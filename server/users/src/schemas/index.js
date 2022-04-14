import Joi from 'joi';
import { Role } from '../middlewares/role';

export default {
  '/auth/register': Joi.object({
    body: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(5).required(),
      role: Joi.number()
        .valid(...Object.values(Role))
        .default(Role.USER),
    }),
  }),

  '/auth/login': Joi.object({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(5).required(),
    }),
  }),

  '/users/delete': Joi.object({
    body: Joi.object({
      id: Joi.string().required(),
    }),
  }),
};
