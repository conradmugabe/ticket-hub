import { afterAll, beforeAll, beforeEach } from 'vitest';
import {
  MongoDBContainer,
  StartedMongoDBContainer,
} from '@testcontainers/mongodb';
import {
  GenericContainer,
  StartedTestContainer,
  TestContainer,
  Wait,
} from 'testcontainers';
import mongoose from 'mongoose';

import { natsClient } from '../src/nats-wrapper';

const sixtySeconds = 60 * 1000;

const natsContainer: TestContainer = new GenericContainer(
  'nats-streaming:0.17.0'
);
let startedNatsContainer: StartedTestContainer;
const nats_client_port = 4223;
const nats_monitoring_port = 8223;
const cluster_id = 'TestClusterId';

const mongoDBContainer = new MongoDBContainer();
let startedMongoDBContainer: StartedMongoDBContainer;

beforeAll(async () => {
  process.env.JWT_KEY = 'TEST KEY';

  startedNatsContainer = await natsContainer
    .withExposedPorts(nats_client_port, nats_monitoring_port)
    .withCommand([
      '-p',
      `${nats_client_port}`,
      '-m',
      `${nats_monitoring_port}`,
      '-hbi',
      '5s',
      '-hbt',
      '5s',
      '-hbf',
      '2',
      '-SD',
      '-cid',
      cluster_id,
    ])
    .withWaitStrategy(Wait.forLogMessage(/.*Streaming Server is ready*/))
    .start();
  startedMongoDBContainer = await mongoDBContainer.start();

  const nats_host = startedNatsContainer.getHost();
  const nats_port = startedNatsContainer.getMappedPort(nats_client_port);
  const nats_url = `http://${nats_host}:${nats_port}`;
  await natsClient.connect(cluster_id, 'test', nats_url);

  const connectionString = `${startedMongoDBContainer.getConnectionString()}/test`;
  await mongoose.connect(connectionString, { directConnection: true });
}, sixtySeconds);

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();

  await startedNatsContainer.stop();
  await startedMongoDBContainer.stop();
}, sixtySeconds);
