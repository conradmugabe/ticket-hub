import { describe, expect, test } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../src/app';
import { signinHandler } from '../handlers';
import { Ticket } from '../../src/models/tickets';

const END_POINT = '/api/v1/tickets';
const testTicketId = new mongoose.Types.ObjectId().toHexString();
const testUserId = new mongoose.Types.ObjectId().toHexString();

describe(`Test ${END_POINT}/:ticketId`, () => {
  const updatedTicketBody = { title: 'updated test title', price: 20 };

  interface TestCase {
    name: string;
    expected: { status: number };
    ticketId?: string;
    isAuthenticated?: boolean;
    updatedTicketBody?: { title?: string; price?: number };
    savedTicket?: { title: string; price: number; userId: string };
    userId?: string;
  }

  const testCases: TestCase[] = [
    {
      name: 'returns 401 if the user is not authenticated',
      expected: { status: 401 },
      ticketId: testTicketId,
    },
    {
      name: 'returns 400 if the title and price are not provided',
      expected: { status: 400 },
      ticketId: testTicketId,
      isAuthenticated: true,
    },
    {
      name: 'returns 400 if the title is not provided',
      expected: { status: 400 },
      ticketId: testTicketId,
      isAuthenticated: true,
      updatedTicketBody: { price: 10 },
    },
    {
      name: 'returns 400 if the title is invalid',
      expected: { status: 400 },
      ticketId: testTicketId,
      isAuthenticated: true,
      updatedTicketBody: { title: '', price: 10 },
    },
    {
      name: 'returns 400 if the price is not provided',
      expected: { status: 400 },
      ticketId: testTicketId,
      isAuthenticated: true,
      updatedTicketBody: { title: 'test' },
    },
    {
      name: 'returns 400 if the price is invalid',
      expected: { status: 400 },
      ticketId: testTicketId,
      isAuthenticated: true,
      updatedTicketBody: { title: 'test', price: -10 },
    },
    {
      name: 'returns 404 if the ticket is not found',
      expected: { status: 404 },
      ticketId: testTicketId,
      isAuthenticated: true,
      updatedTicketBody,
    },
    {
      name: 'returns 401 if the user does not own the ticket',
      expected: { status: 401 },
      isAuthenticated: true,
      updatedTicketBody,
      savedTicket: {
        title: 'test',
        price: 10,
        userId: testUserId,
      },
    },
    {
      name: 'returns 200 if the ticket is updated',
      expected: { status: 200 },
      isAuthenticated: true,
      updatedTicketBody,
      savedTicket: {
        title: 'test',
        price: 10,
        userId: testUserId,
      },
      userId: testUserId,
    },
  ];

  test.each(testCases)('$name', async (testCase) => {
    let ticketId = testCase.ticketId;

    if (testCase.savedTicket) {
      const ticket = Ticket.build(testCase.savedTicket);
      await ticket.save();

      ticketId = ticket.id;
    }

    const response = await request(app)
      .put(`${END_POINT}/${ticketId}`)
      .set(
        'Cookie',
        testCase.isAuthenticated ? signinHandler(testCase.userId) : []
      )
      .send(testCase.updatedTicketBody);

    expect(response.status).toEqual(testCase.expected.status);

    if (testCase.userId) {
      expect(response.body.title).toEqual(testCase.updatedTicketBody?.title);
      expect(response.body.price).toEqual(testCase.updatedTicketBody?.price);
      expect(response.body.userId).toEqual(testCase.userId);
    }
  });
});
