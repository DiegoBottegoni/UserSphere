import { Request, Response, NextFunction } from 'express';
import { getUser, updateExistingUser, removeUser } from '@/features/users/userController';
import { BadRequestError } from '@/infrastructure/errors/BadRequestError';

// Mock dependencies
jest.mock('@/features/users/userService');
jest.mock('@/server', () => ({
  io: {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
  },
}));
jest.mock('@/infrastructure/socket/connectedUsers', () => ({
  connectedUsers: new Map(),
}));

describe('UserController Integration Tests', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      params: {},
      user: { id: 'test-user-id' } as any, // Mock authenticated user
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as any;
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUser', () => {
    it('should throw BadRequestError if id is missing', async () => {
      req.params = {}; // No id

      await getUser(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
      const error = (next as jest.Mock).mock.calls[0][0];
      expect(error.message).toBe('Missing user id');
    });

    // We could add more tests here, but preserving the original scope (validation)
  });

  describe('updateExistingUser', () => {
    it('should throw BadRequestError if id is missing', async () => {
      req.params = {}; // No id

      await updateExistingUser(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
      const error = (next as jest.Mock).mock.calls[0][0];
      expect(error.message).toBe('Missing user id');
    });
  });

  describe('removeUser', () => {
    it('should throw BadRequestError if id is missing', async () => {
      req.params = {}; // No id

      await removeUser(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
      const error = (next as jest.Mock).mock.calls[0][0];
      expect(error.message).toBe('Missing user id');
    });
  });
});
