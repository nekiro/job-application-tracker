import Joi from 'joi';

const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
  }),
});

export default loginSchema;
