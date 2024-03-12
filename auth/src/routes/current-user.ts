import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { currentUser } from '../middleware/current-user';

const router = express.Router();

router.get('/api/v1/users/currentuser', async (req: Request, res: Response) => {
  return res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
