import { prisma } from '../prisma/client';
import { MessageRepository } from '../../domain/messages/MessageRepository';
import { Message } from '../../domain/messages/Message';

export class MessageRepositoryPrisma implements MessageRepository {
  async sendMessage(senderId: string, receiverId: string, content: string): Promise<Message> {
    return prisma.message.create({
      data: { senderId, receiverId, content },
    });
  }

  async getConversation(userId: string, otherUserId: string): Promise<Message[]> {
    return prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async markAsRead(messageId: string): Promise<Message> {
    return prisma.message.update({
      where: { id: messageId },
      data: { isRead: true },
    });
  }

  async findById(messageId: string): Promise<Message | null> {
    return prisma.message.findUnique({
      where: { id: messageId },
    });
  }

  async deleteMessage(messageId: string): Promise<void> {
    await prisma.message.delete({ where: { id: messageId } });
  }
}
