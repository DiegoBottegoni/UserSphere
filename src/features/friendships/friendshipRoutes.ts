import { Router } from 'express';
import { verifyUserSession } from '@/infrastructure/middleware/authMiddleware';
import {
  sendRequest,
  acceptRequest,
  rejectFriendRequest,
  blockUser,
  getPendingRequests,
  getSentRequests,
  getAllFriends,
} from '@/features/friendships/friendshipController';

const router = Router();

router.post('/:receiverId', verifyUserSession, sendRequest);
router.put('/:friendshipId/accept', verifyUserSession, acceptRequest);
router.patch('/:friendshipId/reject', verifyUserSession, rejectFriendRequest);
router.patch('/:friendshipId/block', verifyUserSession, blockUser);
router.get('/pending', verifyUserSession, getPendingRequests);
router.get('/pending/sent', verifyUserSession, getSentRequests);
router.get('/', verifyUserSession, getAllFriends);

export default router;
