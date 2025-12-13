import { Request, Response, NextFunction } from 'express';
import { verifyRole } from '@/infrastructure/middleware/roleMiddleware';
import { Role } from '@prisma/client';

describe('verifyRole Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      user: { role: Role.USER } as any,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as any;
    next = jest.fn();
  });

  it('should call next if user has allowed role', () => {
    req.user = { role: Role.ADMIN } as any;
    const middleware = verifyRole([Role.ADMIN]);

    middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 403 if user does not have allowed role', () => {
    req.user = { role: Role.USER } as any;
    const middleware = verifyRole([Role.ADMIN]);

    middleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden: Insufficient permissions' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if user is missing', () => {
    req.user = undefined as any;
    const middleware = verifyRole([Role.ADMIN]);

    middleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized: User not found in request' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should allow multiple roles', () => {
    req.user = { role: Role.USER } as any;
    const middleware = verifyRole([Role.ADMIN, Role.USER]);

    middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
  });
});
