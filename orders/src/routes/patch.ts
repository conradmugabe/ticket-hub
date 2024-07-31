import express, { Request, Response } from 'express';
import { NotFoundError, OrderStatus } from '@mors_remorse/ticket-hub-common';

import { Order } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsClient } from '../nats-wrapper';

const router = express.Router();

router.patch('/api/v1/orders/:orderId', async (req: Request, res: Response) => {
  const order = await Order.findOne({
    userId: req.currentUser!.id,
    _id: req.params.orderId,
  }).populate('ticket');

  if (!order) {
    throw new NotFoundError();
  }

  order.status = OrderStatus.Cancelled;
  await order.save();

  await new OrderCancelledPublisher(natsClient.client).publish({
    id: order.id,
    ticket: { id: order.ticket.id },
  });

  return res.send(order);
});

export { router as deleteOrderRouter };
