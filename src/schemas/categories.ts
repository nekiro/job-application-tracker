import Joi from 'joi';

export const addCategory: Joi.ObjectSchema = Joi.object({
  body: {
    name: Joi.string().required(),
    userId: Joi.string().required(),
  },
});
