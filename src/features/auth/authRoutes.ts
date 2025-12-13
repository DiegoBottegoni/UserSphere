import { Router } from 'express';
import {
  register,
  login,
  logout,
  me,
  refresh,
  googleLogin,
  googleCallback,
} from './authController';
import { verifyUserSession } from '@/infrastructure/middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);

router.get('/google', googleLogin);
router.get('/google/callback', googleCallback);

router.get('/me', verifyUserSession, me);
router.post('/logout', verifyUserSession, logout);

export default router;
