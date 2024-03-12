import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/api/v1/users/currentuser', async (req: Request, res: Response) => {
  if (!req.session?.jwt) {
    return res.send({ currentUser: null });
  }

  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);

    return res.send({ currentUser: payload });
  } catch (error) {
    return res.send({ currentUser: null });
  }
});

export { router as currentUserRouter };
