import 'dotenv/config';
import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import {
  NotFoundError,
  currentUser,
  errorHandler,
} from '@mors_remorse/ticket-hub-common';

import { createOrderRouter } from './routes/create';
import { readOneRouter } from './routes/read-one';
import { readManyRouter } from './routes/read-many';
import { deleteOrderRouter } from './routes/patch';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== 'test' })
);

app.use(currentUser);

app.use(createOrderRouter);
app.use(readOneRouter);
app.use(readManyRouter);
app.use(deleteOrderRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
