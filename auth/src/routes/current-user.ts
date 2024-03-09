import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/api/v1/users/currentuser', async (req: Request, res: Response) => {
  return res.send('Hi there!');
});

export { router as currentUserRouter };
