import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/api/v1/users/signup', async (req: Request, res: Response) => {
  return res.send('Hi there!');
});

export { router as signUpRouter };
