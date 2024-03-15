import { describe, expect, test } from 'vitest';
import request from 'supertest';

import { app } from '../../src/app';
import { Ticket } from '../../src/models/tickets';

const END_POINT = '/api/v1/tickets';

describe(`Test ${END_POINT}`, () => {
  interface TestCase {
    name: string;
    expectedStatus: number;
    loadedTickets?: { title: string; price: string; userId: string }[];
    expectedNumberOfTickets: number;
  }

  const testCases: TestCase[] = [
    {
      name: 'returns an empty array if there are no tickets',
      expectedStatus: 200,
      expectedNumberOfTickets: 0,
      loadedTickets: [],
    },
    {
      name: 'returns all tickets if there are tickets in the database',
      expectedStatus: 200,
      expectedNumberOfTickets: 3,
      loadedTickets: [
        {
          title: 'test 1',
          price: '10',
          userId: '123',
        },
        {
          title: 'test 2',
          price: '20',
          userId: '456',
        },
        {
          title: 'test 3',
          price: '130',
          userId: '789',
        },
      ],
    },
  ];

  test.each(testCases)('$name', async (testCase) => {
    if (testCase.loadedTickets) {
      await Ticket.insertMany(testCase.loadedTickets);
    }

    const response = await request(app).get(END_POINT).send();

    expect(response.body.length).toEqual(testCase.expectedNumberOfTickets);
    expect(response.status).toEqual(testCase.expectedStatus);
  });
});
