import { ValidationError } from './errorHandler';
import schemas from '../schemas';

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

const validateRequest = async (req, _res, next) => {
  const schema = schemas[req.originalUrl];
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

export default validateRequest;
