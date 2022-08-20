import express from 'express';
import Joi from 'joi';
import * as handler from '../controllers/jobs.controller';
import { authenticate } from '../middlewares/authentication';
import { validateRequest } from '../middlewares/validation';

const addJob: Joi.ObjectSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().required(),
    url: Joi.string().uri(),
    index: Joi.number().required(),
    appliedAt: Joi.date().default(Date.now),
    company: Joi.alternatives(
      Joi.string(),
      Joi.object({
        name: Joi.string().required(),
        website: Joi.string().allow('').default(''),
        size: Joi.number().default(0),
      })
    ).required(),
  }),
});

const router = express.Router({ mergeParams: true });

router.post(
  '/',
  validateRequest(addJob),
  authenticate({ sameUserOrAdmin: 'userId' }),
  handler.addJob
);

router.delete(
  '/:jobId',
  authenticate({ sameUserOrAdmin: 'userId' }),
  handler.deleteJob
);

router.get('/', authenticate({ sameUserOrAdmin: 'userId' }), handler.getJobs);

router.get(
  '/:jobId',
  authenticate({ sameUserOrAdmin: 'userId' }),
  handler.getJob
);

export default router;
