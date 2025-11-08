import { Request, Response } from 'express';
import * as messageService from './messageService';

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const senderId = req.user?.id;
    const { receiverId, content } = req.body;

    if (!senderId || !receiverId || !content) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const message = await messageService.sendMessage(senderId, receiverId, content);
    return res.status(201).json(message);
  } catch (error) {
    return res.status(500).json({ message: 'Error sending message' });
  }
};

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
    return res.status(500).json({ message: 'Error fetching conversation' });
  }
};

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
    return res.json(message);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: (error as Error).message });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    if (!messageId) {
      return res.status(400).json({ message: 'Message ID is required' });
    }
    await messageService.deleteMessage(messageId);
    return res.json({ message: 'Message deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting message' });
  }
};
