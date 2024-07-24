import { describe, expect, test } from 'vitest';
import request from 'supertest';

import { app } from '../../src/app';
import { signinHandler } from '../handlers';
import { Ticket } from '../../src/models/ticket';
import mongoose from 'mongoose';
import { OrderStatus } from '@mors_remorse/ticket-hub-common';

const END_POINT = '/api/v1/orders';

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: 'test ticket',
    price: 10,
  });
  await ticket.save();

  return ticket;
};

describe(`Test ${END_POINT}/:orderId PATCH`, () => {
  test("returns an error if the order doesn't exist", async () => {
    await request(app)
      .patch(`${END_POINT}/${new mongoose.Types.ObjectId()}`)
      .set('Cookie', signinHandler())
      .send()
      .expect(404);
  });

  test("returns an error if the user doesn't own the ticket", async () => {
    const ticket = await buildTicket();

    const { body: order } = await request(app)
      .post(END_POINT)
      .set('Cookie', signinHandler())
      .send({ ticketId: ticket.id })
      .expect(201);

    await request(app)
      .patch(`${END_POINT}/${order.id}`)
      .set('Cookie', signinHandler())
      .send()
      .expect(404);
  });

  test('marks an order as cancelled', async () => {
    const ticket = await buildTicket();
    const user = signinHandler();

    const { body: order } = await request(app)
      .post(END_POINT)
      .set('Cookie', user)
      .send({ ticketId: ticket.id })
      .expect(201);

    const { body: fetchedOrder } = await request(app)
      .patch(`${END_POINT}/${order.id}`)
      .set('Cookie', user)
      .send()
      .expect(200);

    expect(fetchedOrder.id).toEqual(order.id);
    expect(fetchedOrder.status).toEqual(OrderStatus.Cancelled);
  });
});
