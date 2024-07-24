import express, { Request, Response } from 'express';
import { NotFoundError } from '@mors_remorse/ticket-hub-common';

import { Order } from '../models/order';

const router = express.Router();

router.get('/api/v1/orders/:orderId', async (req: Request, res: Response) => {
  const order = await Order.findOne({
    userId: req.currentUser!.id,
    _id: req.params.orderId,
  }).populate('ticket');

  if (!order) {
    throw new NotFoundError();
  }

  return res.send(order);
});

export { router as readOneRouter };
