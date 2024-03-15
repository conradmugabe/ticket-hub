import { describe, expect, test } from 'vitest';
import request from 'supertest';

import { app } from '../../src/app';
import { signinHandler } from '../handlers';

const END_POINT = '/api/v1/tickets';

describe(`Test ${END_POINT}`, () => {
  interface TestCase {
    name: string;
    expectedStatus: number;
    notEqual?: boolean;
    requireAuth?: boolean;
    requestData?: { title?: string; price?: string };
  }

  const testCases: TestCase[] = [
    {
      name: `has route handler listening to ${END_POINT} for post requests`,
      expectedStatus: 404,
      notEqual: true,
    },
    {
      name: 'can only be accessed if the user is signed in',
      expectedStatus: 401,
    },
    {
      name: 'returns a status other than 401 if the user is signed in',
      expectedStatus: 401,
      notEqual: true,
      requireAuth: true,
    },
    {
      name: 'returns an error if an invalid title is provided',
      expectedStatus: 400,
      requireAuth: true,
      requestData: {
        title: '',
        price: '10',
      },
    },
    {
      name: 'returns an error if no title is provided',
      expectedStatus: 400,
      requireAuth: true,
      requestData: { price: '10' },
    },
    {
      name: 'returns an error if an invalid price is provided',
      expectedStatus: 400,
      requireAuth: true,
      requestData: { title: 'test', price: '-10' },
    },
    {
      name: 'returns an error if no price is provided',
      expectedStatus: 400,
      requireAuth: true,
      requestData: { title: 'test' },
    },
    {
      name: 'creates a ticket with valid inputs',
      expectedStatus: 201,
      requireAuth: true,
      requestData: { title: 'test', price: '10' },
    },
  ];

  test.each(testCases)('$name', async (testCase) => {
    const response = await request(app)
      .post(END_POINT)
      .set('Cookie', testCase.requireAuth ? signinHandler() : [])
      .send(testCase.requestData);

    if (testCase.notEqual) {
      expect(response.status).not.toEqual(testCase.expectedStatus);
    } else {
      expect(response.status).toEqual(testCase.expectedStatus);
    }
  });
});
