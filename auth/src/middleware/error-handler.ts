import { Request, Response, NextFunction } from 'express';

import { CustomError } from '../errors/custom-error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let errorMessage = { message: 'Something went wrong' };

  if (err instanceof CustomError) {
    statusCode = err.statusCode;
    errorMessage = err.serializeErrors();
  }

  res.status(statusCode).send(errorMessage);
};
