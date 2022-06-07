import express from 'express';
import * as handler from '../handlers/users.handler';
import { authenticate } from '../middlewares/authentication';
import Role from '../models/role';

const router = express.Router();

// users
router.delete(
  '/:id',
  authenticate({ roles: [Role.ADMIN] }),
  handler.deleteUser
);
// TODO: createUser

router.get('/:id', authenticate(), handler.getUser);
router.get('/', authenticate({ roles: [Role.ADMIN] }), handler.getUsers);

export default router;
