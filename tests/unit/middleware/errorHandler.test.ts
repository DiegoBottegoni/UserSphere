import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '@/infrastructure/middleware/errorHandler';
import { AppError } from '@/infrastructure/errors/AppError';
import { ServiceUnavailableError } from '@/infrastructure/errors/ServiceUnavailableError';
import { UnauthorizedError } from '@/infrastructure/errors/UnauthorizedError';
import { BadRequestError } from '@/infrastructure/errors/BadRequestError';

// Helper to create mock Express request object
const createMockReq = (): Partial<Request> => ({});

// Helper to create mock Express response object
const createMockRes = (): any => {
  const res: any = {
    statusCode: 200,
    responseBody: null,
  };
  res.status = jest.fn((code: number) => {
    res.statusCode = code;
    return res;
  });
  res.json = jest.fn((body: any) => {
    res.responseBody = body;
    return res;
  });
  return res;
};

describe('errorHandler Middleware', () => {
  let req: Request;
  let res: any;
  let next: NextFunction;

  beforeEach(() => {
    req = createMockReq() as Request;
    res = createMockRes();
    next = jest.fn();
  });

  describe('ServiceUnavailableError', () => {
    it('should return 503 with default message', () => {
      const error = new ServiceUnavailableError();
      errorHandler(error as any, req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(503);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Service unavailable. Please try again later.',
      });
    });

    it('should return 503 with custom message', () => {
      const error = new ServiceUnavailableError('Database unavailable');
      errorHandler(error as any, req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(503);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Database unavailable',
      });
    });

    it('should be an instance of AppError', () => {
      const error = new ServiceUnavailableError();
      expect(error).toBeInstanceOf(AppError);
    });

    it('should result in same response as AppError(503)', () => {
      const res2 = createMockRes();
      const next2 = jest.fn();
      
      const serviceUnavailableError = new ServiceUnavailableError('Database unavailable');
      const appError503 = new AppError(503, 'Database unavailable');

      errorHandler(serviceUnavailableError as any, req, res as Response, next);
      errorHandler(appError503 as any, req, res2 as Response, next2);

      expect(res.statusCode).toBe(res2.statusCode);
      expect(res.responseBody).toEqual(res2.responseBody);
    });

    it('should have statusCode property 503', () => {
      const error = new ServiceUnavailableError();
      expect(error.statusCode).toBe(503);
    });
  });

  describe('UnauthorizedError', () => {
    it('should return 401 with default message', () => {
      const error = new UnauthorizedError();
      errorHandler(error as any, req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Unauthorized. Please authenticate to access this resource.',
      });
    });

    it('should return 401 with custom message', () => {
      const error = new UnauthorizedError('Invalid token');
      errorHandler(error as any, req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid token',
      });
    });

    it('should be an instance of AppError', () => {
      const error = new UnauthorizedError();
      expect(error).toBeInstanceOf(AppError);
    });

    it('should result in same response as AppError(401)', () => {
      const res2 = createMockRes();
      const next2 = jest.fn();

      const unauthorizedError = new UnauthorizedError('Invalid token');
      const appError401 = new AppError(401, 'Invalid token');

      errorHandler(unauthorizedError as any, req, res as Response, next);
      errorHandler(appError401 as any, req, res2 as Response, next2);

      expect(res.statusCode).toBe(res2.statusCode);
      expect(res.responseBody).toEqual(res2.responseBody);
    });

    it('should have statusCode property 401', () => {
      const error = new UnauthorizedError();
      expect(error.statusCode).toBe(401);
    });
  });

  describe('BadRequestError', () => {
    it('should return 400 with default message', () => {
      const error = new BadRequestError();
      errorHandler(error as any, req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Bad request. Please check your input and try again.',
      });
    });

    it('should return 400 with custom message', () => {
      const error = new BadRequestError('You cannot send a friendship request to yourself.');
      errorHandler(error as any, req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'You cannot send a friendship request to yourself.',
      });
    });

    it('should be an instance of AppError', () => {
      const error = new BadRequestError();
      expect(error).toBeInstanceOf(AppError);
    });

    it('should result in same response as AppError(400)', () => {
      const res2 = createMockRes();
      const next2 = jest.fn();

      const badRequestError = new BadRequestError('Invalid operation');
      const appError400 = new AppError(400, 'Invalid operation');

      errorHandler(badRequestError as any, req, res as Response, next);
      errorHandler(appError400 as any, req, res2 as Response, next2);

      expect(res.statusCode).toBe(res2.statusCode);
      expect(res.responseBody).toEqual(res2.responseBody);
    });

    it('should have statusCode property 400', () => {
      const error = new BadRequestError();
      expect(error.statusCode).toBe(400);
    });
  });
});
