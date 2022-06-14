import express from 'express';
import * as controller from '../controllers/users.controller';
import { authenticate } from '../middlewares/authentication';
import Role from '../models/role';

const router = express.Router();

// users
router.delete(
  '/:id',
  authenticate({ roles: [Role.ADMIN] }),
  controller.deleteUser
);
// TODO: createUser

router.get('/:id', authenticate(), controller.getUser);
router.get('/', authenticate({ roles: [Role.ADMIN] }), controller.getUsers);

export default router;
