import express, { Request, Response } from 'express';

import { Ticket } from '../models/tickets';

const router = express.Router();

router.get('/api/v1/tickets', async (req: Request, res: Response) => {
  const tickets = await Ticket.find({});

  return res.status(200).send(tickets);
});

export { router as readManyRouter };
