// Middleware to validate session based on JWT token
// Authenticate JWT tokens and attach user to request
// 3 functionalities: verify token, fetch user using id, update lastSeenAt

import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRepositoryPrisma } from '@/infrastructure/users/UserRepositoryPrisma';

interface JwtPayload {
  id: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const userRepository = new UserRepositoryPrisma();

export const verifyUserSession = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized: missing token' });
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Unauthorized: invalid token format' });
    return;
  }

  if (!JWT_SECRET) {
    console.error('JWT_SECRET not defined');
    res.status(500).json({ message: 'Server configuration error' });
    return;
  }

  try {
    const decoded = jwt.verify(token as string, JWT_SECRET) as unknown as JwtPayload;

    const user = await userRepository.findById(decoded.id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Actualiza última actividad
    await userRepository.update(user.id, { lastSeenAt: new Date() });

    req.user = user;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
    return;
  }
};
