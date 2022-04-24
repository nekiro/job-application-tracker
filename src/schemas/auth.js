import Joi from 'joi';
import { Role } from '../middlewares/role';

export const signUp = Joi.object({
  body: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
    role: Joi.number()
      .valid(...Object.values(Role))
      .default(Role.USER),
  }),
});

export const signIn = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
  }),
});

export const signOut = Joi.object({
  body: Joi.object({
    id: Joi.string().required(),
  }),
});
