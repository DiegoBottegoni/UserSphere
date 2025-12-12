import { Server, Socket } from 'socket.io';
import { Prisma } from '@prisma/client';
import { prisma } from '@/infrastructure/prisma/client';
import { UserRepositoryPrisma } from '@/infrastructure/users/UserRepositoryPrisma';
import { connectedUsers } from '@/infrastructure/socket/connectedUsers';

const userRepository = new UserRepositoryPrisma();

export const setupSocket = (io: Server) => {
  io.on('connection', async (socket: Socket) => {
    console.log('🟢 Client connected:', socket.id);

    // ✅ Recuperamos el userId cuando el cliente se registra
    socket.on('register', async (userId: string) => {
      try {
        socket.data.userId = userId;
        connectedUsers.set(userId, socket.id);

        await userRepository.update(userId, {
          isOnline: true,
          lastSeenAt: new Date(),
        });

        io.emit('user:online', userId);
        console.log(`User ${userId} registered on socket ${socket.id}`);
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
          console.warn(`⚠️  Registration failed: User ${userId} not found in database.`);
        } else {
          console.error('Registration error:', err);
        }
      }
    });

    // ✉️ Enviar mensaje
    socket.on('message:send', async ({ senderId, receiverId, content }) => {
      try {
        if (!socket.data.userId || socket.data.userId !== senderId) return;

        const message = await prisma.message.create({
          data: { senderId, receiverId, content },
        });

        const receiverSocket = connectedUsers.get(receiverId);
        if (receiverSocket) {
          io.to(receiverSocket).emit('message:new', message);
        }

        io.to(socket.id).emit('message:sent', message);
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
          console.warn(`⚠️  Message send failed: Sender or Receiver not found.`);
        } else {
          console.error('Error sending message:', err);
        }
      }
    });

    // 👁️ Marcar como leído
    socket.on('message:read', async (messageId: string) => {
      try {
        const updated = await prisma.message.update({
          where: { id: messageId },
          data: { isRead: true },
        });

        const senderSocket = connectedUsers.get(updated.senderId);
        if (senderSocket) {
          io.to(senderSocket).emit('message:read', updated);
        }

        io.to(socket.id).emit('message:read', updated);
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
          console.warn(`⚠️  Mark read failed: Message ${messageId} not found.`);
        } else {
          console.error('Error marking message as read:', err);
        }
      }
    });

    // 🔌 Desconexión
    socket.on('disconnect', async () => {
      const userId = socket.data.userId;
      if (!userId) {
        console.log(`Client disconnected without userId: ${socket.id}`);
        return;
      }

      connectedUsers.delete(userId);

      try {
        await userRepository.update(userId, {
          isOnline: false,
          lastSeenAt: new Date(),
        });

        io.emit('user:offline', userId);
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
          // User already deleted or missing, ignore.
        } else {
          console.error('Disconnect error:', err);
        }
      }

      console.log(`🔴 Client disconnected: ${socket.id}`);
    });
  });
};
