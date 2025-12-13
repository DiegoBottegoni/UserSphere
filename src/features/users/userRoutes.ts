import { Router } from 'express';
import { verifyUserSession } from '@/infrastructure/middleware/authMiddleware';
import {
  getUser,
  getUsers,
  createNewUser,
  updateExistingUser,
  removeUser,
} from '@/features/users/userController';

import { verifyRole } from '@/infrastructure/middleware/roleMiddleware';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', verifyUserSession, verifyRole([Role.ADMIN]), getUsers);
router.get('/:id', verifyUserSession, getUser);
router.post('/', verifyUserSession, createNewUser);
router.put('/:id', verifyUserSession, updateExistingUser);
router.delete('/:id', verifyUserSession, verifyRole([Role.ADMIN]), removeUser);

export default router;
