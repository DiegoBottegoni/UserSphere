import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

export const verifyRole = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized: User not found in request' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      return;
    }

    next();
  };
};
