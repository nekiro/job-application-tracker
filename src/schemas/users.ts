import Joi from 'joi';

export const companySchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().required(),
  website: Joi.string().allow('').default(''),
  size: Joi.number().default(0),
  userId: Joi.string().required(),
});

export const addCompany: Joi.ObjectSchema = Joi.object({
  body: companySchema,
});
