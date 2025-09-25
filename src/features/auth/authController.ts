import type { Request, Response } from 'express';
import { registerUser, loginUser } from './authService';

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const response = await registerUser(name, email, password);
    res.status(201).json(response);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const response = await loginUser(email, password);
    res.json(response);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};
