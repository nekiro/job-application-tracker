import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import ValidationError from '../errors/ValidationError';

const options = {
  abortEarly: false,
  allowUnknown: true,
};

export const validateRequest =
  (schema: Joi.ObjectSchema) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    if (!schema) {
      return next();
    }

    const { error, value } = schema.validate(
      { body: req.body, params: req.params, query: req.query },
      options
    );

    if (error) {
      next(new ValidationError(error.details));
    } else {
      req.body = value.body;
      req.params = value.params ?? {};
      req.query = value.query ?? {};
      next();
    }
  };
