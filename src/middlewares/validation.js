import { ValidationError } from './errorHandler';

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

export const validateRequest = (schema) => async (req, _res, next) => {
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
