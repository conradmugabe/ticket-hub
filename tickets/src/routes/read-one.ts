import express, { Request, Response } from 'express';

import { Ticket } from '../models/tickets';
import { NotFoundError } from '@mors_remorse/ticket-hub-common';

const router = express.Router();

router.get('/api/v1/tickets/:id', async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    throw new NotFoundError();
  }

  return res.status(200).send(ticket);
});

export { router as readOneRouter };
