import express from 'express';
import usersController from '../controllers/users.controller';
import { authenticateToken } from '../middlewares/authentication';
import { Role, hasRole } from '../middlewares/role';

const router = express.Router();

// protected
router.delete(
  '/delete',
  authenticateToken,
  hasRole(Role.ADMIN),
  usersController.deleteUser
);
router.get('/:id', authenticateToken, usersController.getUser);

export default router;
