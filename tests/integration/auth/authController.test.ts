import { Request, Response, NextFunction } from 'express';
import { register, login, logout, refresh } from '@/features/auth/authController';
import * as authService from '@/features/auth/authService';

// Mock dependencies
jest.mock('@/features/auth/authService');

describe('AuthController Unit Tests', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      body: {},
      cookies: {},
      user: { id: 'user-id' } as any,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register user and set cookies', async () => {
      req.body = { name: 'Test', email: 'test@e.com', password: 'pass' };
      const mockResult = {
        user: { id: '1', email: 'test@e.com' } as any,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };
      (authService.registerUser as jest.Mock).mockResolvedValue(mockResult);

      await register(req as Request, res as Response, next);

      expect(authService.registerUser).toHaveBeenCalledWith('Test', 'test@e.com', 'pass');
      expect(res.cookie).toHaveBeenCalledWith('accessToken', 'access-token', expect.any(Object));
      expect(res.cookie).toHaveBeenCalledWith('refreshToken', 'refresh-token', expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ user: mockResult.user });
    });

    it('should call next with error on failure', async () => {
      req.body = { email: 'fail' };
      const error = new Error('Fail');
      (authService.registerUser as jest.Mock).mockRejectedValue(error);

      await register(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('login', () => {
    it('should login user and set cookies', async () => {
      req.body = { email: 'test@e.com', password: 'pass' };
      const mockResult = {
        user: { id: '1' } as any,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };
      (authService.loginUser as jest.Mock).mockResolvedValue(mockResult);

      await login(req as Request, res as Response, next);

      expect(authService.loginUser).toHaveBeenCalledWith('test@e.com', 'pass');
      expect(res.cookie).toHaveBeenCalledTimes(2);
      expect(res.json).toHaveBeenCalledWith({ user: mockResult.user });
    });
  });

  describe('refresh', () => {
    it('should return 401 if refresh token is missing', async () => {
      req.cookies = {};
      await refresh(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Missing refresh token' });
    });

    it('should issue new access token', async () => {
      req.cookies = { refreshToken: 'valid-refresh' };
      (authService.refreshAccessToken as jest.Mock).mockResolvedValue('new-access');

      await refresh(req as Request, res as Response, next);

      expect(authService.refreshAccessToken).toHaveBeenCalledWith('valid-refresh');
      expect(res.cookie).toHaveBeenCalledWith('accessToken', 'new-access', expect.any(Object));
      expect(res.json).toHaveBeenCalledWith({ ok: true });
    });
  });

  describe('logout', () => {
    it('should logout and clear cookies', async () => {
      await logout(req as Request, res as Response, next);

      expect(authService.logoutUser).toHaveBeenCalledWith('user-id');
      expect(res.clearCookie).toHaveBeenCalledWith('accessToken');
      expect(res.clearCookie).toHaveBeenCalledWith('refreshToken');
      expect(res.json).toHaveBeenCalledWith({ message: 'Logout successful' });
    });
  });
});
