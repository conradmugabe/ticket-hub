import { describe, expect, test } from 'vitest';
import request from 'supertest';

import { app } from '../../src/app';
import { signinHandler } from '../handlers';
import { Ticket } from '../../src/models/ticket';

const END_POINT = '/api/v1/orders';

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: 'test ticket',
    price: 10,
  });
  await ticket.save();

  return ticket;
};

describe(`Test ${END_POINT} GET`, async () => {
  test('fetches orders for a particular user', async () => {
    const ticketOne = await buildTicket();
    const ticketTwo = await buildTicket();
    const ticketThree = await buildTicket();

    const userOne = signinHandler();
    const userTwo = signinHandler();

    await request(app)
      .post(END_POINT)
      .set('Cookie', userOne)
      .send({ ticketId: ticketOne.id })
      .expect(201);

    const { body: orderOne } = await request(app)
      .post(END_POINT)
      .set('Cookie', userTwo)
      .send({ ticketId: ticketTwo.id })
      .expect(201);

    const { body: orderTwo } = await request(app)
      .post(END_POINT)
      .set('Cookie', userTwo)
      .send({ ticketId: ticketThree.id })
      .expect(201);

    const response = await request(app)
      .get(END_POINT)
      .set('Cookie', userTwo)
      .send()
      .expect(200);

    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderOne.id);
    expect(response.body[1].id).toEqual(orderTwo.id);
    expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
    expect(response.body[1].ticket.id).toEqual(ticketThree.id);
  });
});
