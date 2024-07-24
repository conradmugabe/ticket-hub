import { requireAuth } from '@mors_remorse/ticket-hub-common';
import express, { Request, Response } from 'express';
import { Order } from '../models/order';

const router = express.Router();

router.get(
  '/api/v1/orders',
  requireAuth,
  async (req: Request, res: Response) => {
    const orders = await Order.find({ userId: req.currentUser!.id }).populate(
      'ticket'
    );

    return res.send(orders);
  }
);

export { router as readManyRouter };
