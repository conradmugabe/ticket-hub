import { describe, expect, test } from 'vitest';
import request from 'supertest';

import { app } from '../../src/app';

describe('signout route', () => {
  interface RequestData {
    email: string;
    password: string;
  }
  interface TestCase {
    name: string;
    signupRequestData?: RequestData;
    expectedStatus: number;
  }

  const testCases: TestCase[] = [
    {
      name: 'clears cookie on successful signout',
      signupRequestData: { email: 'test@test.com', password: 'password' },
      expectedStatus: 200,
    },
    {
      name: 'clears cookie even when no cookie is sent',
      expectedStatus: 200,
    },
  ];

  test.each(testCases)('$name', async (testCase) => {
    if (testCase.signupRequestData) {
      await request(app)
        .post('/api/v1/users/signup')
        .send(testCase.signupRequestData)
        .expect(201);
    }

    const response = await request(app).post('/api/v1/users/signout').send();

    expect(response.statusCode).toEqual(testCase.expectedStatus);
    expect(response.get('Set-Cookie')[0]).toEqual(
      'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
    );
  });
});
