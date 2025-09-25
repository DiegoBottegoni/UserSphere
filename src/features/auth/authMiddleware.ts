import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from './authService';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = verifyToken(token);
    (req as any).user = decoded; // attach user to request
    return next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};
