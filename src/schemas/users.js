import Joi from 'joi';

export const JobStatus = Object.freeze({
  APPLIED: 1,
  HR: 2,
  TECH: 3,
  ACCEPTED: 4,
  REJECTED: 5,
});

export const JobLevel = Object.freeze({
  JUNIOR: 1,
  MID: 2,
  SENIOR: 3,
});

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
