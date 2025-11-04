import { Router } from 'express';
import { verifyUserSession } from '../../infrastructure/middleware/authMiddleware';
import {
  sendMessage,
  getConversation,
  markAsRead,
  deleteMessage,
} from './messageController';

const router = Router();

router.post('/', verifyUserSession, sendMessage);
router.get('/:otherUserId', verifyUserSession, getConversation);
router.patch('/:messageId/read', verifyUserSession, markAsRead);
router.delete('/:messageId', verifyUserSession, deleteMessage);

export default router;
