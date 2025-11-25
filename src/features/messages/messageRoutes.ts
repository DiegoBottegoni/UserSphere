import { Router } from 'express';
import { verifyUserSession } from '@/infrastructure/middleware/authMiddleware';
import {
  sendMessage,
  getConversation,
  getLastMessages,
  markAsRead,
  deleteMessage,
} from '@/features/messages/messageController';

const router = Router();

router.post('/', verifyUserSession, sendMessage);
router.get('/last', verifyUserSession, getLastMessages);
router.get('/:otherUserId', verifyUserSession, getConversation);
router.patch('/:messageId/read', verifyUserSession, markAsRead);
router.delete('/:messageId', verifyUserSession, deleteMessage);

export default router;
