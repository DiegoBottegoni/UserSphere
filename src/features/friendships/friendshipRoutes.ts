import { Router } from 'express';
import { verifyUserSession } from '../../infrastructure/middleware/authMiddleware';
import {
  sendRequest,
  acceptRequest,
  rejectFriendRequest,
  blockUser,
  getPendingRequests,
  getAllFriends,
} from './friendshipController';

const router = Router();

router.post('/:receiverId', verifyUserSession, sendRequest); // working
router.put('/:friendshipId/accept', verifyUserSession, acceptRequest); // working
router.put('/:friendshipId/reject', verifyUserSession, rejectFriendRequest); // it works but crash the bbdd
router.put('/:friendshipId/block', verifyUserSession, blockUser); // need to fix it to use the user id instead of friendshipId
router.get('/pending', verifyUserSession, getPendingRequests); // working
router.get('/', verifyUserSession, getAllFriends); // working

export default router;
