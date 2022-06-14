import express from 'express';
import * as handler from '../controllers/jobs.controller';
import { authenticate } from '../middlewares/authentication';
import { validateRequest } from '../middlewares/validation';
import * as schemas from '../schemas/users';

const router = express.Router();

router.post(
  '/',
  validateRequest(schemas.addJob),
  authenticate({ sameUserOrAdmin: 'id' }),
  handler.addJob
);

router.get('/', authenticate({ sameUserOrAdmin: 'id' }), handler.getJobs);

router.get('/:id', authenticate({ sameUserOrAdmin: 'userId' }), handler.getJob);

export default router;
