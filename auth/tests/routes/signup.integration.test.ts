import { describe, expect, test } from 'vitest';
import request from 'supertest';

import { app } from '../../src/app';

describe('sigup route', () => {
  interface RequestData {
    email?: string;
    password?: string;
  }

  interface TestCase {
    name: string;
    requests: {
      requestData?: RequestData;
      checkCookie?: boolean;
      expectedStatus: number;
    }[];
  }

  const testCases: TestCase[] = [
    {
      name: 'should return 400 with missing email and password',
      requests: [{ expectedStatus: 400 }],
    },
    {
      name: 'returns 400 with invalid email',
      requests: [
        {
          requestData: {
            email: 'test',
            password: 'password',
          },
          expectedStatus: 400,
        },
      ],
    },
    {
      name: 'returns 400 with invalid password',
      requests: [
        {
          requestData: {
            email: 'test@test.com',
            password: 'p',
          },
          expectedStatus: 400,
        },
      ],
    },
    {
      name: 'returns 400 with missing email',
      requests: [
        {
          requestData: {
            password: 'password',
          },
          expectedStatus: 400,
        },
      ],
    },
    {
      name: 'returns 400 with missing password',
      requests: [
        {
          requestData: {
            email: 'test@test.com',
          },
          expectedStatus: 400,
        },
      ],
    },
    {
      name: 'returns 400 if duplicate email is used',
      requests: [
        {
          requestData: {
            email: 'test@test.com',
            password: 'password',
          },
          expectedStatus: 201,
        },
        {
          requestData: {
            email: 'test@test.com',
            password: 'password',
          },
          expectedStatus: 400,
        },
      ],
    },
    {
      name: 'returns 201 if valid request',
      requests: [
        {
          requestData: {
            email: 'test@test.com',
            password: 'password',
          },
          expectedStatus: 201,
        },
      ],
    },
    {
      name: 'returns a cookie with valid credentials',
      requests: [
        {
          requestData: {
            email: 'test@test.com',
            password: 'password',
          },
          checkCookie: true,
          expectedStatus: 201,
        },
      ],
    },
  ];

  test.each(testCases)('$name', async (testCase) => {
    for (const testRequest of testCase.requests) {
      const response = await request(app)
        .post('/api/v1/users/signup')
        .send(testRequest.requestData);

      expect(response.status).toBe(testRequest.expectedStatus);

      if (testRequest.checkCookie) {
        expect(response.get('Set-Cookie')).toBeDefined();
      }
    }
  });
});
