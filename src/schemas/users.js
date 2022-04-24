import Joi from 'joi';
import { JobLevel } from '../models/job';
import { JobStatus } from '../models/job';

export const companySchema = Joi.object({
  name: Joi.string().required(),
  website: Joi.string().allow('').default(''),
  size: Joi.number().default(0),
});

export const addJob = Joi.object({
  body: Joi.object({
    name: Joi.string().required(),
    level: Joi.number()
      .required()
      .valid(...Object.values(JobLevel)),
    status: Joi.number()
      .valid(...Object.values(JobStatus))
      .default(JobStatus.APPLIED),
    appliedAt: Joi.date().default(Date.now),
    company: Joi.alternatives(Joi.string(), companySchema).required(),
  }),
});

export const addCompany = Joi.object({
  body: companySchema,
});
