import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRepositoryPrisma } from '@/infrastructure/users/UserRepositoryPrisma';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const repo = new UserRepositoryPrisma();

export const verifyUserSession = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: 'Missing access token' });

  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as { id: string };
    const user = await repo.findById(decoded.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    req.user = user;

    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired access token' });
  }
};
