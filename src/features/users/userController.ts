import type { Request, Response, NextFunction } from 'express';
import {
  getUserById,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  searchUsers as searchUsersService,
} from '@/features/users/userService';
import { CreateUserDTO, UpdateUserDTO } from '@/domain/users/dto';
import { BadRequestError } from '@/infrastructure/errors/BadRequestError';
import { io } from '@/server';
import { connectedUsers } from '@/infrastructure/socket/connectedUsers';

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id) throw new BadRequestError('Missing user id');

    const user = await getUserById(id);
    return res.json(user);
  } catch (err) {
    next(err);
    return;
  }
};

export const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
    return;
  }
};

export const createNewUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: CreateUserDTO = req.body;
    const user = await createUser(data);
    res.status(201).json(user);
  } catch (err) {
    next(err);
    return;
  }
};

export const updateExistingUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userIdFromToken = req.user?.id;

    if (!id) throw new BadRequestError('Missing user id');
    if (userIdFromToken !== id)
      return res.status(403).json({ error: 'You are not authorized to update this user' });

    const data: UpdateUserDTO = req.body;
    const updatedUser = await updateUser(id, data);

    // 🔥 Emitir evento solo a usuarios conectados
    connectedUsers.forEach((socketId, userId) => {
      if (userId !== id) io.to(socketId).emit('user:updated', updatedUser);
    });

    return res.json(updatedUser);
  } catch (err) {
    next(err);
    return;
  }
};

export const removeUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userIdFromToken = req.user?.id;

    if (!id) throw new BadRequestError('Missing user id');

    if (userIdFromToken !== id) {
      return res.status(403).json({ error: 'You are not authorized to delete this user' });
    }

    await deleteUser(id);
    return res.status(204).send();
  } catch (err) {
    next(err);
    return;
  }
};

export const searchUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      throw new BadRequestError('Missing or invalid search query parameter "q"');
    }

    if (q.trim().length < 2) {
      throw new BadRequestError('Search query must be at least 2 characters');
    }

    const users = await searchUsersService(q.trim());
    return res.json(users);
  } catch (err) {
    next(err);
    return;
  }
};
