import jwt from 'jsonwebtoken';

export const signinHandler = () => {
  const payload = { id: '1234567890', email: 'test@test.com' };

  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);

  const base64 = Buffer.from(sessionJSON).toString('base64');

  return [`session=${base64}`];
};
