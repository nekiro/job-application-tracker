import express from 'express';
import * as handler from '../handlers/companies.handler';
import { authenticate } from '../middlewares/authentication';
import { validateRequest } from '../middlewares/validation';
import * as schemas from '../schemas/users';

const router = express.Router();

router.post(
  '/',
  validateRequest(schemas.addCompany),
  authenticate({ sameUserOrAdmin: 'id' }),
  handler.addCompany
);

router.get('/', authenticate({ sameUserOrAdmin: 'id' }), handler.getCompanies);

router.get('/:id', authenticate({ sameUserOrAdmin: 'id' }), handler.getCompany);

export default router;
