import { describe, expect, test } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { OrderStatus } from '@mors_remorse/ticket-hub-common';

import { app } from '../../src/app';
import { signinHandler } from '../handlers';
import { Ticket } from '../../src/models/ticket';
import { Order } from '../../src/models/order';

const END_POINT = '/api/v1/orders';

describe(`Test ${END_POINT}`, () => {
  interface TestCase {
    name: string;
    requestData: { ticketId?: string | mongoose.Types.ObjectId };
    state: { requireAuth?: boolean; isReserved?: boolean };
    expected: { status: number; isSaved?: true };
  }

  const testCases: TestCase[] = [
    {
      name: 'returns an error if the ticket does not exist',
      requestData: { ticketId: new mongoose.Types.ObjectId() },
      state: { requireAuth: true },
      expected: { status: 404 },
    },
    {
      name: 'returns an error if the ticket is already reserved',
      requestData: {},
      state: { requireAuth: true, isReserved: true },
      expected: { status: 400 },
    },
    {
      name: 'reserves a ticket',
      requestData: {},
      state: { requireAuth: true },
      expected: { status: 201, isSaved: true },
    },
  ];

  test.each(testCases)('$name', async (testCase) => {
    let ticketId = testCase.requestData.ticketId;

    if (!testCase.requestData.ticketId) {
      const ticket = Ticket.build({ title: 'test ticket', price: 10 });
      await ticket.save();

      ticketId = ticket.id;

      if (testCase.state.isReserved) {
        const order = Order.build({
          ticket,
          status: OrderStatus.Created,
          expiresAt: new Date(),
          userId: '123',
        });
        await order.save();
      }
    }

    const response = await request(app)
      .post(END_POINT)
      .set('Cookie', testCase.state.requireAuth ? signinHandler() : [])
      .send({ ticketId });

    expect(response.status).toBe(testCase.expected.status);

    if (testCase.expected.isSaved) {
      const order = await Order.findById(response.body.id).populate('ticket');
      expect(order).not.toBeNull();

      expect(order!.status).toEqual(OrderStatus.Created);
      expect(order!.ticket!.id).toEqual(ticketId);
    }
  });
});
