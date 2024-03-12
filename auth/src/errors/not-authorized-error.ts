import { CustomError } from './custom-error';

const NOT_AUTHORIZED_ERROR_MESSAGE = 'Not authorized';

export class NotAuthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super(NOT_AUTHORIZED_ERROR_MESSAGE);

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return { message: NOT_AUTHORIZED_ERROR_MESSAGE };
  }
}
