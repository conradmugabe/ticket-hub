import { describe, expect, test } from 'vitest';
import request from 'supertest';

import { app } from '../../src/app';

describe('current user route', () => {
  interface TestCase {
    name: string;
    isAuthenticated?: boolean;
    expected?: { email: string };
  }

  const testCases: TestCase[] = [
    { name: 'should return null if not authenticated' },
    {
      name: 'should return user if authenticated',
      expected: { email: 'test@test.com' },
      isAuthenticated: true,
    },
  ];

  test.each(testCases)('$name', async (testCase) => {
    let cookie: string[] = [];

    if (testCase.isAuthenticated) {
      const authResponse = await request(app)
        .post('/api/v1/users/signup')
        .send({
          email: 'test@test.com',
          password: 'password',
        });
      cookie = authResponse.get('Set-Cookie');
    }

    const response = await request(app)
      .get('/api/v1/users/currentuser')
      .set('Cookie', cookie)
      .send();

    expect(response.statusCode).toEqual(200);

    if (testCase.expected) {
      expect(response.body.currentUser.email).toEqual(testCase.expected.email);
    }

    if (!testCase.isAuthenticated) {
      expect(response.body.currentUser).toEqual(null);
    }
  });
});
