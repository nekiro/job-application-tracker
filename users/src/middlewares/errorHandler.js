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

const formatError = (message, code) => {
  return {
    error: message,
    errorCode: code,
  };
};

const errorHandler = (err, _req, res, _next) => {
  if (res.headersSent) {
    return _next(err);
  }

  switch (err.constructor) {
    case ValidationError:
      return res.status(400).send(
        formatError(
          err.what.map((e) => e.message),
          400
        )
      );

    case TokenExpiredError:
      return res
        .status(401)
        .send(formatError(`Token expired at ${err.expiredAt}`, 401));

    case JsonWebTokenError:
      return res.status(401).send(formatError(err.message, 401));

    case NotBeforeError:
      return res
        .status(401)
        .send(formatError(`Token activates at ${err.date}`, 401));

    case InvalidRoleError:
      return res.status(401).send(formatError(err.message, 401));

    default:
      console.log(err);
      return res.status(500).send(err);
  }
};

export default errorHandler;
