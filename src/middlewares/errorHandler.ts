import {
  TokenExpiredError,
  JsonWebTokenError,
  NotBeforeError,
} from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import ValidationError from '../errors/ValidationError';
import AuthError from '../errors/AuthError';
import InvalidRoleError from '../errors/InvalidRoleError';
import NotFoundError from '../errors/NotFoundError';
import ResourceExistsError from '../errors/ResourceExistsError';
import APIError from '../types/APIError';

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }

  const error: APIError = {
    errorType: err.name,
    error: 'Internal Server Error',
  };

  let errorCode: number = 500;

  switch (err.constructor) {
    case ValidationError:
      if (err instanceof ValidationError) {
        error.error = {};

        err.what.forEach((e: any) => {
          //@ts-ignore
          error.error[e.context.key] = e.message.split('"').join('');
        });
      }

      errorCode = 400;

      break;

    case TokenExpiredError:
      if (err instanceof TokenExpiredError) {
        error.error = `Token expired at ${err.expiredAt}`;
      }
      errorCode = 401;

      break;

    case NotBeforeError:
      if (err instanceof NotBeforeError) {
        error.error = `Token activates at ${err.date}`;
      }
      errorCode = 401;
      break;

    case JsonWebTokenError:
    case InvalidRoleError:
    case AuthError:
      error.error = err.message;
      errorCode = 401;
      break;

    case NotFoundError:
      error.error = err.message;
      errorCode = 404;
      break;

    case ResourceExistsError:
      error.error = err.message;
      errorCode = 409;
      break;

    case PrismaClientKnownRequestError:
      if (err instanceof PrismaClientKnownRequestError) {
        switch (err.code) {
          default:
            error.error = err.message;
            break;
        }
      }
      break;

    default:
      break;
  }

  res.status(errorCode).json(error);
};

export default errorHandler;
