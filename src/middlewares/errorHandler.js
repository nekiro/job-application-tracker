import {
  TokenExpiredError,
  JsonWebTokenError,
  NotBeforeError,
} from 'jsonwebtoken';

export class ValidationError extends Error {
  constructor(what) {
    super('');
    this.what = what.details;
    this.name = 'ValidationError';
  }
}

export class InvalidRoleError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidRoleError';
  }
}

export class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthError';
  }
}

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

const errorHandler = (err, _req, res, _next) => {
  if (res.headersSent) {
    return _next(err);
  }

  const error = {
    errorType: err.name,
    errorCode: 500,
  };

  switch (err.constructor) {
    case ValidationError:
      error.error = {};

      err.what.forEach((e) => {
        error.error[e.context.key] = e.message.split('"').join('');
      });

      error.errorCode = 400;
      break;

    case TokenExpiredError:
      error.error = `Token expired at ${err.expiredAt}`;
      error.errorCode = 401;
      break;

    case JsonWebTokenError:
      error.error = err.message;
      error.errorCode = 401;
      break;

    case NotBeforeError:
      error.error = `Token activates at ${err.date}`;
      error.errorCode = 401;
      break;

    case InvalidRoleError:
      error.error = err.message;
      error.errorCode = 401;
      break;

    case AuthError:
      error.error = err.message;
      error.errorCode = 401;
      break;

    case NotFoundError:
      error.error = err.message;
      error.errorCode = 404;
      break;

    default:
      console.log(err);
      error.error = 'Internal Server Error';
      break;
  }

  res.status(error.errorCode).send({ ...error, ['errorCode']: undefined });
};

export default errorHandler;
