import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

export const signinHandler = (
  userId = new mongoose.Types.ObjectId().toHexString()
) => {
  const payload = { id: userId, email: 'test@test.com' };

  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);

  const base64 = Buffer.from(sessionJSON).toString('base64');

  return [`session=${base64}`];
};
