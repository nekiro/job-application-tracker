import express from 'express';
import * as controller from '../controllers/users.controller';
import { authenticate } from '../middlewares/authentication';
import Role from '../models/role';
import categoriesRouter from './categories';

const router = express.Router();

// users
router.delete(
  '/:userId',
  authenticate({ roles: [Role.ADMIN] }),
  controller.deleteUser
);
// TODO: createUser

router.get('/:userId', authenticate(), controller.getUser);
router.get('/', authenticate({ roles: [Role.ADMIN] }), controller.getUsers);

// categories
router.use('/:userId/categories', categoriesRouter);

export default router;
