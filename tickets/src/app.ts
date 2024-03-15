import 'dotenv/config';
import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import {
  NotFoundError,
  currentUser,
  errorHandler,
} from '@mors_remorse/ticket-hub-common';

import { createTicketRouter } from './routes/create';
import { readOneRouter } from './routes/read-one';
import { readManyRouter } from './routes/read-many';
import { updateTicketRouter } from './routes/update';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== 'test' })
);

app.use(currentUser);

app.use(createTicketRouter);
app.use(readOneRouter);
app.use(readManyRouter);
app.use(updateTicketRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
