import { prisma } from '@/infrastructure/prisma/client';
import { Friendship, FriendshipStatus } from '@prisma/client';
import { FriendshipRepository } from '@/domain/friendships/FriendshipRepository';
import { FriendshipPreview } from '@/domain/friendships/dtos/FriendshipPreview';

export class FriendshipRepositoryPrisma implements FriendshipRepository {
  async sendRequest(requesterId: string, receiverId: string): Promise<Friendship> {
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

  async getPendingRequests(userId: string): Promise<FriendshipPreview[]> {
    const requests = await prisma.friendship.findMany({
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

    return requests.map(req => ({
      id: req.id,
      status: req.status,
      friend: req.requester,
    }));
  }

  async getSentRequests(userId: string): Promise<FriendshipPreview[]> {
    const sent = await prisma.friendship.findMany({
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

    return sent.map(req => ({
      id: req.id,
      status: req.status,
      friend: req.receiver,
    }));
  }

  async getAllFriends(userId: string): Promise<FriendshipPreview[]> {
    const friendships = await prisma.friendship.findMany({
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

    return friendships.map(f => {
      const friend = f.requesterId === userId ? f.receiver : f.requester;
      return {
        id: f.id,
        status: f.status,
        friend,
      };
    });
  }
}
