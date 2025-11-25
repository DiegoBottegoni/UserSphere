import { Router } from 'express';
import { verifyUserSession } from '@/infrastructure/middleware/authMiddleware';
import {
  getUser,
  getUsers,
  createNewUser,
  updateExistingUser,
  removeUser,
} from '@/features/users/userController';

const router = Router();

router.get('/', verifyUserSession, getUsers);
router.get('/:id', verifyUserSession, getUser);
router.post('/', verifyUserSession, createNewUser);
router.put('/:id', verifyUserSession, updateExistingUser);
router.delete('/:id', verifyUserSession, removeUser);

export default router;
