import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { Server as SocketIOServer } from 'socket.io';

import authRoutes from '@/features/auth/authRoutes';
import userRoutes from '@/features/users/userRoutes';
import friendshipRoutes from '@/features/friendships/friendshipRoutes';
import messageRoutes from '@/features/messages/messageRoutes';

import { errorHandler } from '@/infrastructure/middleware/errorHandler';
import { setupSocket } from '@/infrastructure/socket/socketHandler';

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());

export const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  },
});

setupSocket(io);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/friendships', friendshipRoutes);
app.use('/api/v1/messages', messageRoutes);

app.use(errorHandler);

app.use('/docs', express.static(path.join(__dirname, '../docs')));

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '../docs/api-docs.html'));
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
