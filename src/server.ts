import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';

import authRoutes from './features/auth/authRoutes';
import userRoutes from './features/users/userRoutes';
import friendshipRoutes from './features/friendships/friendshipRoutes';
import messageRoutes from './features/messages/messageRoutes';

import { errorHandler } from './infrastructure/middleware/errorHandler';
import { setupSocket } from './infrastructure/socket/socketHandler';

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
}));

app.use(express.json());

export const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  },
});

setupSocket(io);

// ✅ Rutas de la API
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/friendships', friendshipRoutes);
app.use('/api/v1/messages', messageRoutes);

app.use(errorHandler);

app.get('/', (_req, res) => {
  res.send('Hello to UserSphere user management API!');
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
