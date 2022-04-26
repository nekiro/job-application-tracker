import express from 'express';
import * as handler from '../handlers/auth.handler';
import * as schemas from '../schemas/auth';
import { authenticate } from '../middlewares/authentication';
import { validateRequest } from '../middlewares/validation';

const router = express.Router();

router.post('/sign-in', validateRequest(schemas.signIn), handler.signIn);
router.post('/sign-out', authenticate(), handler.signOut);
router.post('/sign-up', validateRequest(schemas.signUp), handler.signUp);

export default router;
