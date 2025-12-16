import { prisma } from '@/infrastructure/prisma/client';
import { MessageRepository } from '@/domain/messages/MessageRepository';
import { Message, MessageStatus } from '@/domain/messages/Message';
import { LastMessageDTO } from '@/domain/messages/responses';
import { MessageStatus as PrismaMessageStatus } from '@prisma/client';

export class MessageRepositoryPrisma implements MessageRepository {
  async sendMessage(senderId: string, receiverId: string, content: string): Promise<Message> {
    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
        status: PrismaMessageStatus.SENT,
      },
      include: {
        sender: {
          select: { id: true, name: true, email: true, isOnline: true },
        },
        receiver: {
          select: { id: true, name: true, email: true, isOnline: true },
        },
      },
    });

    return {
      ...message,
      status: message.status as MessageStatus,
    };
  }

  async getConversation(userId: string, otherUserId: string): Promise<Message[]> {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: { id: true, name: true, email: true, isOnline: true },
        },
        receiver: {
          select: { id: true, name: true, email: true, isOnline: true },
        },
      },
    });

    return messages.map(m => ({
      ...m,
      status: m.status as MessageStatus,
    }));
  }

  async getLastMessages(userId: string): Promise<LastMessageDTO[]> {
    // Note: status is an enum in Postgres, casting to text might be needed depending on driver,
    // but Prisma raw usually validates this. We select "status" column.
    const messages = await prisma.$queryRaw<
      {
        id: string;
        senderId: string;
        receiverId: string;
        content: string;
        status: string;
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

    const formattedMessages = messages.map(m => ({
      ...m,
      status: m.status as MessageStatus,
      otherUserId: m.senderId === userId ? m.receiverId : m.senderId,
    }));

    const otherUserIds = [...new Set(formattedMessages.map(m => m.otherUserId))];

    const users = await prisma.user.findMany({
      where: { id: { in: otherUserIds } },
      select: { id: true, name: true, email: true, isOnline: true },
    });

    const userMap = new Map(users.map(u => [u.id, u]));

    return formattedMessages.map(m => {
      const otherUser = userMap.get(m.otherUserId);
      return {
        ...m,
        otherUser: otherUser
          ? {
              id: otherUser.id,
              name: otherUser.name,
              email: otherUser.email,
              isOnline: otherUser.isOnline,
            }
          : undefined,
      };
    });
  }

  async markAsRead(messageId: string): Promise<Message> {
    const message = await prisma.message.update({
      where: { id: messageId },
      data: { status: PrismaMessageStatus.READ },
      include: {
        sender: {
          select: { id: true, name: true, email: true, isOnline: true },
        },
        receiver: {
          select: { id: true, name: true, email: true, isOnline: true },
        },
      },
    });

    return {
      ...message,
      status: message.status as MessageStatus,
    };
  }

  async findById(messageId: string): Promise<Message | null> {
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: {
        sender: {
          select: { id: true, name: true, email: true, isOnline: true },
        },
        receiver: {
          select: { id: true, name: true, email: true, isOnline: true },
        },
      },
    });

    if (!message) return null;

    return {
      ...message,
      status: message.status as MessageStatus,
    };
  }

  async deleteMessage(messageId: string): Promise<void> {
    await prisma.message.delete({ where: { id: messageId } });
  }
}
