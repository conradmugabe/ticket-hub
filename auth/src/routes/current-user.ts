import express, { Request, Response } from 'express';
import { currentUser } from '@mors_remorse/ticket-hub-common';


const router = express.Router();

router.get(
  '/api/v1/users/currentuser',
  currentUser,
  async (req: Request, res: Response) => {
    return res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };
