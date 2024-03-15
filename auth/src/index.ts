import mongoose from 'mongoose';
import { checkEnvironmentVariables } from '@mors_remorse/ticket-hub-common';

import { app } from './app';

const PORT = process.env.PORT || 8000;

const ENV_VARIABLES = ['AUTH_MONGO_URI', 'JWT_KEY'];

const start = async () => {
  checkEnvironmentVariables(ENV_VARIABLES);

  try {
    await mongoose.connect(process.env.AUTH_MONG_URI!);
    console.log('Connected to mongo database');
  } catch (error) {
    console.error(error);
  }

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};

start();
