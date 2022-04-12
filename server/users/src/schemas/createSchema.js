import Joi from 'joi';
import { Role } from '../middlewares/role';

const registerSchema = Joi.object({
  body: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    role: Joi.number()
      .valid(...Object.values(Role))
      .default(Role.USER),
  }),
});

export default registerSchema;
