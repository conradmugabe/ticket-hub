import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@mors_remorse/ticket-hub-common';

const router = express.Router();

router.post(
  '/api/v1/tickets',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    console.log(req.body);
    return res.status(201).send({});
  }
);

export { router as createTicketRouter };
