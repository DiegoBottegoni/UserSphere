import { MessageRepositoryPrisma } from '@/infrastructure/messages/MessageRepositoryPrisma';

const messageRepo = new MessageRepositoryPrisma();

export const sendMessage = async (senderId: string, receiverId: string, content: string) => {
  return await messageRepo.sendMessage(senderId, receiverId, content);
};

export const getConversation = async (userId: string, otherUserId: string) => {
  return await messageRepo.getConversation(userId, otherUserId);
};

export const getLastMessages = async (userId: string) => {
  return await messageRepo.getLastMessages(userId);
};

export const markAsRead = async (messageId: string, userId: string) => {
  const message = await messageRepo.findById(messageId);

  if (!message) {
    throw new Error('Message not found');
  }

  if (message.senderId === userId) {
    throw new Error('Sender cannot mark own message as read');
  }

  if (message.receiverId !== userId) {
    throw new Error('User not authorized to mark this message as read');
  }

  return await messageRepo.markAsRead(messageId);
};

export const deleteMessage = async (messageId: string) => {
  await messageRepo.deleteMessage(messageId);
};
