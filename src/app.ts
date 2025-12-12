import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

import authRoutes from '@/features/auth/authRoutes';
import userRoutes from '@/features/users/userRoutes';
import friendshipRoutes from '@/features/friendships/friendshipRoutes';
import messageRoutes from '@/features/messages/messageRoutes';

import { errorHandler } from '@/infrastructure/middleware/errorHandler';

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(cookieParser());

  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/friendships', friendshipRoutes);
  app.use('/api/v1/messages', messageRoutes);

  app.use(errorHandler);

  app.use('/docs', express.static(path.join(__dirname, '../docs')));

  app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, '../docs/api-docs.html'));
  });

  return app;
};
