import { afterAll, beforeAll, beforeEach } from 'vitest';
import {
  MongoDBContainer,
  StartedMongoDBContainer,
} from '@testcontainers/mongodb';
import mongoose from 'mongoose';

const sixtySeconds = 60 * 1000;

const container = new MongoDBContainer();
let startedContainer: StartedMongoDBContainer;

beforeAll(async () => {
  startedContainer = await container.start();

  await mongoose.connect(startedContainer.getConnectionString());
}, sixtySeconds);

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();

  await startedContainer.stop();
}, sixtySeconds);
