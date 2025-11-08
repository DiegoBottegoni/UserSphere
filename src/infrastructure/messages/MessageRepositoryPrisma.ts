import { prisma } from '../prisma/client';
import { MessageRepository } from '../../domain/messages/MessageRepository';
import { Message } from '../../domain/messages/Message';
import { LastMessageDTO } from '../../domain/messages/responses';

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

  async getLastMessages(userId: string): Promise<LastMessageDTO[]> {
  const messages = await prisma.$queryRaw<
    {
      id: string;
      senderId: string;
      receiverId: string;
      content: string;
      isRead: boolean;
      createdAt: Date;
      updatedAt: Date;
    }[]
  >`
    SELECT DISTINCT ON (
      LEAST("senderId", "receiverId"),
      GREATEST("senderId", "receiverId")
    ) *
    FROM "Message"
    WHERE "senderId" = ${userId} OR "receiverId" = ${userId}
    ORDER BY
      LEAST("senderId", "receiverId"),
      GREATEST("senderId", "receiverId"),
      "createdAt" DESC
  `;

  return messages.map(m => ({
    ...m,
    otherUserId: m.senderId === userId ? m.receiverId : m.senderId,
  }));
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
