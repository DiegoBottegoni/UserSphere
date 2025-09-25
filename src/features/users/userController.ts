import type { Request, Response } from 'express';
import { getUserById, getAllUsers, createUser, updateUser, deleteUser } from './userService';
import { CreateUserDTO } from '../../domain/users/dto/CreateUserDTO';
import { UpdateUserDTO } from '../../domain/users/dto/UpdateUserDTO';

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Missing user id' });

    const user = await getUserById(id);
    return res.json(user);
  } catch (err: any) {
    return res.status(404).json({ error: err.message });
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createNewUser = async (req: Request, res: Response) => {
  try {
    const data: CreateUserDTO = req.body;
    const user = await createUser(data);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateExistingUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Missing user id' });

    const data: UpdateUserDTO = req.body;
    const user = await updateUser(id, data);
    return res.json(user);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

export const removeUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Missing user id' });

    await deleteUser(id);
    return res.status(204).send();
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};
