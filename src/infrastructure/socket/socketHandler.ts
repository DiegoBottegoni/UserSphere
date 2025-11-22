import { Server, Socket } from 'socket.io';
import { prisma } from '../prisma/client';
import { UserRepositoryPrisma } from '../users/UserRepositoryPrisma';

// 🧩 Registro global de conexiones activas
const connectedUsers = new Map<string, string>(); // userId -> socketId
const userRepository = new UserRepositoryPrisma();

export const setupSocket = (io: Server) => {
  io.on('connection', async (socket: Socket) => {
    console.log('🟢 New client connected:', socket.id);

    // 🧩 Registrar usuario y guardar su socket
    socket.on('register', async (userId: string) => {
      try {
        socket.data.userId = userId;
        connectedUsers.set(userId, socket.id); // Guardamos el socket.id asociado al userId

        await prisma.user.update({
          where: { id: userId },
          data: { isOnline: true, lastLoginAt: new Date() },
        });

        console.log(`✅ User ${userId} registered (socket: ${socket.id})`);
        io.emit('user:online', userId);
      } catch (err) {
        console.error('❌ Error registering user:', err);
      }
    });

    // ✉️ Enviar mensaje
    socket.on('message:send', async (data) => {
      try {
        const { senderId, receiverId, content } = data;

        const message = await prisma.message.create({
          data: { senderId, receiverId, content },
        });

        console.log(`💬 Message created from ${senderId} to ${receiverId}`);

        // Buscar el socket del receptor
        const receiverSocketId = connectedUsers.get(receiverId);

        if (receiverSocketId) {
          io.to(receiverSocketId).emit('message:new', message);
          console.log(`📨 Sent to receiver socket ${receiverSocketId}`);
        } else {
          console.log(`⚠️ Receiver ${receiverId} is offline`);
        }

        // Emitir confirmación al emisor
        io.to(socket.id).emit('message:sent', message);
      } catch (err) {
        console.error('❌ Error sending message:', err);
      }
    });

    // 👁️ Marcar mensaje como leído
    socket.on('message:read', async (messageId: string) => {
      try {
        const updated = await prisma.message.update({
          where: { id: messageId },
          data: { isRead: true },
        });

        console.log(`👁️ Message ${messageId} marked as read`);

        // Notificar al emisor original si está online
        const senderSocketId = connectedUsers.get(updated.senderId);
        if (senderSocketId) {
          io.to(senderSocketId).emit('message:read', updated);
        }

        // También podés notificar al lector (opcional)
        io.to(socket.id).emit('message:read', updated);
      } catch (err) {
        console.error('❌ Error marking message as read:', err);
      }
    });

    // 🔌 Desconexión
    socket.on('disconnect', async () => {
      const userId = socket.data.userId;

      if (userId) {
        connectedUsers.delete(userId);

        try {
          await prisma.user.update({
            where: { id: userId },
            data: { isOnline: false, lastSeenAt: new Date() },
          });

          io.emit('user:offline', userId);
        } catch (err) {
          console.error('❌ Error on disconnect:', err);
        }
      }

      console.log(`🔴 Client disconnected: ${socket.id}`);
    });
  });
};
