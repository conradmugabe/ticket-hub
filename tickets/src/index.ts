import mongoose from 'mongoose';
import { checkEnvironmentVariables } from '@mors_remorse/ticket-hub-common';

import { app } from './app';
import { natsClient } from './nats-wrapper';

const PORT = process.env.PORT || 8000;

const ENV_VARIABLES = ['MONGO_URI', 'JWT_KEY', 'NATS_CLUSTER_ID', 'NATS_CLIENT_ID', 'NATS_URL'];

const start = async () => {
  checkEnvironmentVariables(ENV_VARIABLES);

  try {
    await natsClient.connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URL!
    );
    natsClient.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });
    process.on('SIGINT', () => natsClient.client.close());
    process.on('SIGTERM', () => natsClient.client.close());

    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Connected to mongo database');
  } catch (error) {
    console.error(error);
  }

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};

start();
