import type { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser, logoutUser } from '@/features/auth/authService';
import { UnauthorizedError } from '@/infrastructure/errors/UnauthorizedError';
import type { LoginResponseDTO, RegisterResponseDTO } from '@/domain/auth/dto';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    const response: RegisterResponseDTO = await registerUser(name, email, password);
    res.status(201).json(response);
  } catch (err: any) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const response: LoginResponseDTO = await loginUser(email, password);
    res.json(response);
  } catch (err: any) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) throw new UnauthorizedError('User not authenticated');

    await logoutUser(userId);
    res.json({ message: 'Logout successful' });
  } catch (err: any) {
    next(err);
  }
};
