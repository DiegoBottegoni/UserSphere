import type { Request, Response } from 'express';
import { getUserById } from './userService';

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Missing user id' });
    }
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
    return;
  } catch (err: any) {
    res.status(500).json({ error: err.message });
    return;
  }
};
