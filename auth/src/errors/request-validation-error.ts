import { ValidationError } from 'express-validator';

import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
  statusCode = 400;
  constructor(private error: ValidationError) {
    super("Invalid request parameters");

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    if (this.error.type === 'field')
      return { message: this.error.msg, field: this.error.type };

    return { message: this.error.msg };
  }
}
