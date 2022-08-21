import Joi from 'joi';
import { deepSetProperties } from '../util';

class ValidationError extends Error {
  errors: Joi.ValidationErrorItem[];

  constructor(errors: Joi.ValidationErrorItem[]) {
    super('');
    this.errors = errors;
    this.name = 'ValidationError';
  }

  getErrorMessage() {
    return this.errors.map((joiErr) => {
      if (!joiErr.context) return;

      const key = joiErr.path.slice(1).join('.');
      return deepSetProperties({
        [key]: joiErr.message
          .replaceAll('"', '')
          .replace(
            joiErr.context.label as string,
            joiErr.context.key as string
          ),
      });
    });
  }
}

export default ValidationError;
