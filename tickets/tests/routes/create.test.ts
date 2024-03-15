import { describe, expect, test } from 'vitest';
import request from 'supertest';

import { app } from '../../src/app';

const END_POINT = '/api/v1/tickets';

describe(`Test ${END_POINT}`, () => {
  interface TestCase {
    name: string;
    expectedStatus: number;
    notEqual?: boolean;
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
    // {
    //   name: 'returns a status other than 401 if the user is signed in',
    //   expectedStatus: 401,
    //   notEqual: true,
    // },
    // { name: 'returns an error if an invalid title is provided' },
    // { name: 'returns an error if no title is provided' },
    // { name: 'returns an error if an invalid price is provided' },
    // { name: 'returns an error if no price is provided' },
    // { name: 'creates a ticket with valid inputs' },
  ];

  test.each(testCases)('$name', async (testCase) => {
    const response = await request(app).post(END_POINT).send({});

    if (testCase.notEqual) {
      expect(response.status).not.toEqual(testCase.expectedStatus);
    } else {
      expect(response.status).toEqual(testCase.expectedStatus);
    }
  });
});
