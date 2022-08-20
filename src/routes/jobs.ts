import express from 'express';
import * as handler from '../controllers/jobs.controller';
import { authenticate } from '../middlewares/authentication';
import { validateRequest } from '../middlewares/validation';
import * as schemas from '../schemas/users';

const router = express.Router({ mergeParams: true });

router.post(
  '/',
  validateRequest(schemas.addJob),
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
