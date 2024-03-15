import { describe, expect, test } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../src/app';
import { Ticket } from '../../src/models/tickets';

const END_POINT = '/api/v1/tickets';

describe(`Test ${END_POINT}/:ticketId`, () => {
  interface TestCase {
    name: string;
    expectedStatus: number;
    ticketId?: string;
  }

  const testCases: TestCase[] = [
    {
      name: 'returns a ticket if the ticket is found',
      expectedStatus: 200,
    },
    {
      name: 'returns an error if the ticket is not found',
      expectedStatus: 404,
      ticketId: new mongoose.Types.ObjectId().toHexString(),
    },
  ];

  test.each(testCases)('$name', async (testCase) => {
    let ticketId = testCase.ticketId;

    if (!testCase.ticketId) {
      const ticket = Ticket.build({ title: 'test', price: 10, userId: '123' });
      await ticket.save();

      ticketId = ticket.id;
    }

    const response = await request(app).get(`${END_POINT}/${ticketId}`).send();

    expect(response.status).toEqual(testCase.expectedStatus);
  });
});
