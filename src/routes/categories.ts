import express from 'express';
import * as handler from '../controllers/category.controller';
import { authenticate } from '../middlewares/authentication';
import { validateRequest } from '../middlewares/validation';
import * as schemas from '../schemas/categories';
import jobsRouter from './jobs';

const router = express.Router({ mergeParams: true });

router.post(
  '/',
  validateRequest(schemas.addCategory),
  authenticate({ sameUserOrAdmin: 'id' }),
  handler.addCategory
);

router.delete(
  '/:categoryId',
  authenticate({ sameUserOrAdmin: 'id' }),
  handler.deleteCategory
);

router.get('/', authenticate({ sameUserOrAdmin: 'id' }), handler.getCategories);

router.get(
  '/:categoryId',
  authenticate({ sameUserOrAdmin: 'id' }),
  handler.getCategory
);

// jobs
router.use('/:categoryId/jobs', jobsRouter);

export default router;
