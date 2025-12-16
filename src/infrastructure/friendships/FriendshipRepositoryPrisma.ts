import { prisma } from '@/infrastructure/prisma/client';
import { Friendship, FriendshipStatus } from '@prisma/client';
import {
  FriendshipRepository,
  FriendshipWithRelations,
} from '@/domain/friendships/FriendshipRepository';

export class FriendshipRepositoryPrisma implements FriendshipRepository {
  async sendRequest(requesterId: string, receiverId: string): Promise<Friendship> {
    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId, receiverId },
          { requesterId: receiverId, receiverId: requesterId },
        ],
      },
    });

    if (existing) {
      throw new Error('Friendship or pending request already exists');
    }

    return prisma.friendship.create({
      data: {
        requesterId,
        receiverId,
        status: FriendshipStatus.PENDING,
      },
    });
  }

  async acceptRequest(friendshipId: string): Promise<Friendship> {
    return prisma.friendship.update({
      where: { id: friendshipId },
      data: { status: FriendshipStatus.ACCEPTED },
    });
  }

  async rejectRequest(friendshipId: string): Promise<{ requesterId: string; receiverId: string }> {
    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId },
    });

    if (!friendship) {
      throw new Error('Friendship not found');
    }

    const { requesterId, receiverId } = friendship;

    await prisma.message.deleteMany({
      where: {
        OR: [
          { senderId: requesterId, receiverId: receiverId },
          { senderId: receiverId, receiverId: requesterId },
        ],
      },
    });

    await prisma.friendship.delete({
      where: { id: friendshipId },
    });

    return { requesterId, receiverId };
  }

  async blockUser(friendshipId: string): Promise<Friendship> {
    return prisma.friendship.update({
      where: { id: friendshipId },
      data: { status: FriendshipStatus.BLOCKED },
    });
  }

  async getPendingRequests(userId: string): Promise<FriendshipWithRelations[]> {
    return prisma.friendship.findMany({
      where: {
        receiverId: userId,
        status: FriendshipStatus.PENDING,
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            isOnline: true,
            lastSeenAt: true,
          },
        },
      },
    });
  }

  async getSentRequests(userId: string): Promise<FriendshipWithRelations[]> {
    return prisma.friendship.findMany({
      where: {
        requesterId: userId,
        status: FriendshipStatus.PENDING,
      },
      include: {
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            isOnline: true,
            lastSeenAt: true,
          },
        },
      },
    });
  }

  async getAllFriends(userId: string): Promise<FriendshipWithRelations[]> {
    return prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: userId, status: FriendshipStatus.ACCEPTED },
          { receiverId: userId, status: FriendshipStatus.ACCEPTED },
        ],
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            isOnline: true,
            lastSeenAt: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            isOnline: true,
            lastSeenAt: true,
          },
        },
      },
    });
  }
}
