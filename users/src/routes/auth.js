import express from 'express';
import authController from '../controllers/auth.controller';
import authenticateToken from '../middlewares/authentication';

const router = express.Router();

router.post('/login', authController.login);
router.post('/logout', authenticateToken, authController.logout);
router.post('/register', authController.register);

export default router;
