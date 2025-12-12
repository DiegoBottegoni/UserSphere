import { Request, Response } from 'express';
import * as messageService from '@/features/messages/messageService';
import { io } from '@/server';
import { connectedUsers } from '@/infrastructure/socket/connectedUsers';

// ============================
// POST /messages
// ============================
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const senderId = req.user?.id;
    const { receiverId, content } = req.body;

    if (!senderId || !receiverId || !content) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const message = await messageService.sendMessage(senderId, receiverId, content);

    // 🔔 Emitir al receptor si está online
    const receiverSocketId = connectedUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('message:new', message);
    }

    // 🔔 Emitir confirmación al remitente (aunque sea vía API)
    const senderSocketId = connectedUsers.get(senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit('message:sent', message);
    }

    return res.status(201).json(message);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error sending message' });
  }
};

// ============================
// GET /messages/conversation/:otherUserId
// ============================
export const getConversation = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { otherUserId } = req.params;

    if (!userId || !otherUserId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const messages = await messageService.getConversation(userId, otherUserId);
    return res.json(messages);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching conversation' });
  }
};

// ============================
// GET /messages/last
// ============================
export const getLastMessages = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const lastMessages = await messageService.getLastMessages(userId);
    return res.json(lastMessages);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching last messages' });
  }
};

// ============================
// PATCH /messages/:messageId/read
// ============================
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const userId = req.user?.id;

    if (!messageId) {
      return res.status(400).json({ message: 'Message ID is required' });
    }

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const message = await messageService.markAsRead(messageId, userId);

    // 🔔 Emitir evento al emisor si está online
    const senderSocketId = connectedUsers.get(message.senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit('message:read', {
        messageId,
        readerId: userId,
      });
    }

    return res.json(message);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: (error as Error).message });
  }
};

// ============================
// DELETE /messages/:messageId
// ============================
export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;

    if (!messageId) {
      return res.status(400).json({ message: 'Message ID is required' });
    }

    await messageService.deleteMessage(messageId);

    // 🔔 Emitir evento a cualquier usuario conectado que corresponda
    io.emit('message:deleted', { messageId });

    return res.json({ message: 'Message deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error deleting message' });
  }
};
