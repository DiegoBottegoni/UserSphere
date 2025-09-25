import { Router } from 'express';
import { authenticate } from '../auth/authMiddleware';
import { getUser, getUsers, createNewUser, updateExistingUser, removeUser } from './userController';

const router = Router();

router.get('/', authenticate, getUsers);
router.get('/:id', authenticate, getUser);
router.post('/', authenticate, createNewUser);
router.put('/:id', authenticate, updateExistingUser);
router.delete('/:id', authenticate, removeUser);

export default router;
