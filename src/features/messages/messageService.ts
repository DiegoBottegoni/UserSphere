import { MessageRepositoryPrisma } from '../../infrastructure/messages/MessageRepositoryPrisma';

const messageRepo = new MessageRepositoryPrisma();

export const sendMessage = async (senderId: string, receiverId: string, content: string) => {
  return await messageRepo.sendMessage(senderId, receiverId, content);
};

export const getConversation = async (userId: string, otherUserId: string) => {
  return await messageRepo.getConversation(userId, otherUserId);
};

export const markAsRead = async (messageId: string) => {
  return await messageRepo.markAsRead(messageId);
};

export const deleteMessage = async (messageId: string) => {
  await messageRepo.deleteMessage(messageId);
};
