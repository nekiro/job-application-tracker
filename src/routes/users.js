import express from 'express';
import * as handler from '../handlers/users.handler';
import { authenticate } from '../middlewares/authentication';
import { validateRequest } from '../middlewares/validation';
import * as schemas from '../schemas/users';

const router = express.Router();

// users
router.delete('/:id', authenticate({ adminOnly: true }), handler.deleteUser);
router.get('/:id', authenticate(), handler.getUser);

// jobs
router.post(
  '/:id/jobs',
  validateRequest(schemas.addJob),
  authenticate({ sameUserOrAdmin: 'id' }),
  handler.addJob
);

router.get(
  '/:id/jobs',
  authenticate({ sameUserOrAdmin: 'id' }),
  handler.getJobs
);
router.get(
  '/:userId/jobs/:jobId',
  authenticate({ sameUserOrAdmin: 'userId' }),
  handler.getJob
);

// companies
router.post(
  '/:id/companies',
  validateRequest(schemas.addCompany),
  authenticate({ sameUserOrAdmin: 'id' }),
  handler.addCompany
);
router.get(
  '/:id/companies',
  authenticate({ sameUserOrAdmin: 'id' }),
  handler.getCompanies
);
router.get(
  '/:id/companies/:companyId',
  authenticate({ sameUserOrAdmin: 'id' }),
  handler.getCompany
);

export default router;
