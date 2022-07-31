import express from 'express';
import * as handler from '../controllers/category.controller';
import { authenticate } from '../middlewares/authentication';
import { validateRequest } from '../middlewares/validation';
import * as schemas from '../schemas/categories';

const router = express.Router();

router.post(
  '/',
  validateRequest(schemas.addCategory),
  authenticate({ sameUserOrAdmin: 'id' }),
  handler.addCategory
);

router.delete(
  '/:id',
  authenticate({ sameUserOrAdmin: 'id' }),
  handler.deleteCategory
);

router.get('/', authenticate({ sameUserOrAdmin: 'id' }), handler.getCategories);

router.get(
  '/:id',
  authenticate({ sameUserOrAdmin: 'id' }),
  handler.getCategory
);

export default router;
