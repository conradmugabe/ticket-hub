import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/api/v1/users/signout', async (req: Request, res: Response) => {
  req.session = null;

  return res.send({});
});

export { router as signOutRouter };
