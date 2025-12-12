import { Request, Response } from 'express';
import {
  sendMessage,
  getConversation,
  getLastMessages,
  markAsRead,
  deleteMessage,
} from '@/features/messages/messageController';
import * as messageService from '@/features/messages/messageService';

// Mock dependencies
jest.mock('@/features/messages/messageService');
jest.mock('@/server', () => ({
  io: {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
  },
}));
jest.mock('@/infrastructure/socket/connectedUsers', () => ({
  connectedUsers: new Map(),
}));

describe('MessageController Unit Tests', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      user: { id: 'user-1' } as any,
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('sendMessage', () => {
    it('should send message and return 201', async () => {
      req.body = { receiverId: 'user-2', content: 'Hello' };
      const mockMessage = {
        id: 'msg-1',
        senderId: 'user-1',
        receiverId: 'user-2',
        content: 'Hello',
      };
      (messageService.sendMessage as jest.Mock).mockResolvedValue(mockMessage);

      await sendMessage(req as Request, res as Response);

      expect(messageService.sendMessage).toHaveBeenCalledWith(
        'user-1',
        'user-2',
        'Hello'
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockMessage);
    });

    it('should return 400 if fields are missing', async () => {
      req.body = { receiverId: 'user-2' }; // missing content

      await sendMessage(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Missing required fields',
      });
    });
  });

  describe('getConversation', () => {
    it('should return conversation messages', async () => {
      req.params = { otherUserId: 'user-2' };
      const mockMessages = [{ id: 'msg-1', content: 'Hi' }];
      (messageService.getConversation as jest.Mock).mockResolvedValue(
        mockMessages
      );

      await getConversation(req as Request, res as Response);

      expect(messageService.getConversation).toHaveBeenCalledWith(
        'user-1',
        'user-2'
      );
      expect(res.json).toHaveBeenCalledWith(mockMessages);
    });
  });

  describe('getLastMessages', () => {
    it('should return last messages for user', async () => {
      const mockLastMessages = [{ id: 'msg-1' }];
      (messageService.getLastMessages as jest.Mock).mockResolvedValue(
        mockLastMessages
      );

      await getLastMessages(req as Request, res as Response);

      expect(messageService.getLastMessages).toHaveBeenCalledWith('user-1');
      expect(res.json).toHaveBeenCalledWith(mockLastMessages);
    });

    it('should return 401 if user not authenticated', async () => {
      delete req.user;

      await getLastMessages(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe('markAsRead', () => {
    it('should mark message as read', async () => {
      req.params = { messageId: 'msg-1' };
      const mockMessage = { id: 'msg-1', isRead: true, senderId: 'user-2' };
      (messageService.markAsRead as jest.Mock).mockResolvedValue(mockMessage);

      await markAsRead(req as Request, res as Response);

      expect(messageService.markAsRead).toHaveBeenCalledWith('msg-1', 'user-1');
      expect(res.json).toHaveBeenCalledWith(mockMessage);
    });
  });

  describe('deleteMessage', () => {
    it('should delete message', async () => {
      req.params = { messageId: 'msg-1' };

      await deleteMessage(req as Request, res as Response);

      expect(messageService.deleteMessage).toHaveBeenCalledWith('msg-1');
      expect(res.json).toHaveBeenCalledWith({ message: 'Message deleted' });
    });
  });
});
