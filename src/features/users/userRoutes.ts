import { Router } from 'express';
import { getUser } from './userController';
import { authenticate } from '../auth/authMiddleware';

const router = Router();

router.get('/:id', authenticate, getUser);

export default router;
