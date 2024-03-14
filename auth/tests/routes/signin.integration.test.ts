import { describe, expect, test } from 'vitest';
import request from 'supertest';

import { app } from '../../src/app';

describe('signin route', () => {
  interface RequestData {
    email?: string;
    password?: string;
  }

  interface TestCase {
    name: string;
    requestData?: RequestData;
    expectedStatus: number;
    signupRequestData?: Required<RequestData>;
    checkCookie?: boolean;
  }

  const testCases: TestCase[] = [
    {
      name: 'returns 400 if no email or password is provided',
      expectedStatus: 400,
    },
    {
      name: 'returns 400 with invalid email',
      requestData: { email: 'invalid', password: 'password' },
      expectedStatus: 400,
    },
    {
      name: 'returns 400 if email is not provided',
      requestData: { password: 'password' },
      expectedStatus: 400,
    },
    {
      name: 'returns 400 if password is not provided',
      requestData: { email: 'test@test.com' },
      expectedStatus: 400,
    },
    {
      name: 'returns 400 if user does not exist',
      requestData: { email: 'test@test.com', password: 'password' },
      expectedStatus: 400,
    },
    {
      name: 'returns 400 if password is incorrect',
      signupRequestData: { email: 'test@test.com', password: 'password' },
      requestData: { email: 'test@test.com', password: 'test_password' },
      expectedStatus: 400,
    },
    {
      name: 'returns 200 with valid credentials',
      signupRequestData: { email: 'test@test.com', password: 'password' },
      requestData: { email: 'test@test.com', password: 'password' },
      expectedStatus: 200,
    },
    {
      name: 'returns cookie with valid credentials',
      signupRequestData: { email: 'test@test.com', password: 'password' },
      requestData: { email: 'test@test.com', password: 'password' },
      expectedStatus: 200,
      checkCookie: true,
    },
  ];

  test.each(testCases)('$name', async (testCase) => {
    if (testCase.signupRequestData) {
      await request(app)
        .post('/api/v1/users/signup')
        .send(testCase.signupRequestData)
        .expect(201);
    }

    const response = await request(app)
      .post('/api/v1/users/signin')
      .send(testCase.requestData);

    expect(response.status).toBe(testCase.expectedStatus);

    if (testCase.checkCookie) {
      expect(response.get('Set-Cookie')).toBeDefined();
    }
  });
});
