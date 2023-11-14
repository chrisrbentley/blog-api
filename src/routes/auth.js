import { Router } from 'express';
import authController from '../controllers/authController.js';

const router = Router();

router.post('/users', authController.onSignUp);

router.post('/sessions', authController.onLogin);

export default router;
