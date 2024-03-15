import { requireAuth } from '@mors_remorse/ticket-hub-common';
import express, { Request, Response } from 'express';

const router = express.Router();

router.post(
  '/api/v1/tickets',
  requireAuth,
  async (req: Request, res: Response) => {
    return res.status(201).send({});
  }
);

export { router as createTicketRouter };
