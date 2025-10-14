import type { Request, Response, NextFunction } from 'express';
import { getUserById, getAllUsers, createUser, updateUser, deleteUser } from './userService';
import { CreateUserDTO, UpdateUserDTO } from '../../domain/users/dto';

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Missing user id' });

    const user = await getUserById(id);
    return res.json(user);
  } catch (err: any) {
    next(err);
    return;
  }
};

export const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err: any) {
    next(err);
    return;
  }
};

export const createNewUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: CreateUserDTO = req.body;
    const user = await createUser(data);
    res.status(201).json(user);
  } catch (err: any) {
    next(err);
    return;
  }
};

export const updateExistingUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'Missing user id' });
      return;
    }

    const data: UpdateUserDTO = req.body;
    const user = await updateUser(id, data);
    return res.json(user);
  } catch (err: any) {
    next(err);
    return;
  }
};

export const removeUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Missing user id' });

    await deleteUser(id);
    return res.status(204).send();
  } catch (err: any) {
    next(err);
    return;
  }
};
