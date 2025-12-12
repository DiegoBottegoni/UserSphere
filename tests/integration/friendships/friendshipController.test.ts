import { Request, Response } from 'express';
import {
  sendRequest,
  acceptRequest,
  rejectFriendRequest,
  blockUser,
  getPendingRequests,
  getSentRequests,
  getAllFriends,
} from '@/features/friendships/friendshipController';
import * as friendshipService from '@/features/friendships/friendshipService';

// Mock dependencies
jest.mock('@/features/friendships/friendshipService');
jest.mock('@/server', () => ({
  io: {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
  },
}));
jest.mock('@/infrastructure/socket/connectedUsers', () => ({
  connectedUsers: new Map(),
}));

describe('FriendshipController Unit Tests', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      user: { id: 'user-1' } as any,
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('sendRequest', () => {
    it('should send friendship request and return 201', async () => {
      req.params = { receiverId: 'user-2' };
      const mockFriendship = {
        id: 'friendship-1',
        requesterId: 'user-1',
        receiverId: 'user-2',
        status: 'PENDING',
      };
      (friendshipService.sendRequest as jest.Mock).mockResolvedValue(
        mockFriendship
      );

      await sendRequest(req as Request, res as Response);

      expect(friendshipService.sendRequest).toHaveBeenCalledWith(
        'user-1',
        'user-2'
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockFriendship);
    });

    it('should return 401 if user not authenticated', async () => {
      delete req.user;

      await sendRequest(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe('acceptRequest', () => {
    it('should accept request and return 200', async () => {
      req.params = { friendshipId: 'friendship-1' };
      const mockFriendship = {
        id: 'friendship-1',
        requesterId: 'user-1',
        receiverId: 'user-2',
        status: 'ACCEPTED',
      };
      (friendshipService.acceptRequest as jest.Mock).mockResolvedValue(
        mockFriendship
      );

      await acceptRequest(req as Request, res as Response);

      expect(friendshipService.acceptRequest).toHaveBeenCalledWith(
        'friendship-1'
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('rejectFriendRequest', () => {
    it('should reject request and return 200', async () => {
      req.params = { friendshipId: 'friendship-1' };
      const mockResult = {
        requesterId: 'user-1',
        receiverId: 'user-2',
        status: 'REJECTED',
      };
      (friendshipService.rejectFriendRequest as jest.Mock).mockResolvedValue(
        mockResult
      );

      await rejectFriendRequest(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Friendship and messages deleted successfully',
      });
    });
  });

  describe('blockUser', () => {
    it('should block user and return 200', async () => {
      req.params = { friendshipId: 'friendship-1' };
      const mockFriendship = {
        id: 'friendship-1',
        requesterId: 'user-1',
        receiverId: 'user-2',
        status: 'BLOCKED',
      };
      (friendshipService.blockUser as jest.Mock).mockResolvedValue(
        mockFriendship
      );

      await blockUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getPendingRequests', () => {
    it('should return pending requests', async () => {
      const mockPending = [{ id: 'friendship-1', status: 'PENDING' }];
      (friendshipService.getPendingRequests as jest.Mock).mockResolvedValue(
        mockPending
      );

      await getPendingRequests(req as Request, res as Response);

      expect(friendshipService.getPendingRequests).toHaveBeenCalledWith(
        'user-1'
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPending);
    });
  });

  describe('getSentRequests', () => {
    it('should return sent requests', async () => {
      const mockSent = [{ id: 'friendship-1', status: 'PENDING' }];
      (friendshipService.getSentRequests as jest.Mock).mockResolvedValue(
        mockSent
      );

      await getSentRequests(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSent);
    });
  });

  describe('getAllFriends', () => {
    it('should return all friends', async () => {
      const mockFriends = [{ id: 'friendship-1', status: 'ACCEPTED' }];
      (friendshipService.getAllFriends as jest.Mock).mockResolvedValue(
        mockFriends
      );

      await getAllFriends(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockFriends);
    });
  });
});
