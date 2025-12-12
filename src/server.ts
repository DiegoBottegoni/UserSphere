import http from 'http';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';

import { createApp } from './app';
import { setupSocket } from '@/infrastructure/socket/socketHandler';

dotenv.config();

const app = createApp();
const server = http.createServer(app);

export const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  },
});

setupSocket(io);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export { app, server };
