import type { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser } from './authService';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  try {
    const response = await registerUser(name, email, password);
    res.status(201).json(response);
  } catch (err: any) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const response = await loginUser(email, password);
    res.json(response);
  } catch (err: any) {
    next(err);
  }
};
