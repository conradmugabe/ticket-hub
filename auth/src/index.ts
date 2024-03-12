import mongoose from 'mongoose';

import { app } from './app';
import { checkEnvironmentVariables } from './utils/env';

const PORT = process.env.PORT || 8000;

const start = async () => {
  checkEnvironmentVariables();

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('Connected to mongo database');
  } catch (error) {
    console.error(error);
  }

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};

start();
