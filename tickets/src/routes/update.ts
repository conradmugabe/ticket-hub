import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@mors_remorse/ticket-hub-common';

import { Ticket } from '../models/tickets';

const router = express.Router();

router.put(
  '/api/v1/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    ticket.set('price', req.body.price);
    ticket.set('title', req.body.title);
    await ticket.save();

    return res.status(200).send(ticket);
  }
);

export { router as updateTicketRouter };
