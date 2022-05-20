import Joi from 'joi';
import { Role } from '../middlewares/role';

export const signUp: Joi.ObjectSchema = Joi.object({
  body: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
    role: Joi.string()
      .valid(...Object.values(Role))
      .default(Role.USER),
  }),
});

export const signIn: Joi.ObjectSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
  }),
});

export const userExcludedKeys: string[] = ['password', 'tokenSecret'];
