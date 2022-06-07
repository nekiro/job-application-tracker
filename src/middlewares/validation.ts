import { NextFunction, Request, Response } from 'express';

import ValidationError from '../errors/ValidationError';

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

export const validateRequest =
  (schema: any) => async (req: Request, _res: Response, next: NextFunction) => {
    if (!schema) {
      return next();
    }

    const { error, value } = schema.validate(
      { body: req.body, params: req.params, query: req.query },
      options
    );

    if (error) {
      next(new ValidationError(error));
    } else {
      req.body = value.body;
      req.params = value.params ?? {};
      req.query = value.query ?? {};
      next();
    }
  };
