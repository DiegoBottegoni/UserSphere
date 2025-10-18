import { prisma } from '../prisma/client';
import { Friendship, FriendshipStatus } from '@prisma/client';
import { FriendshipRepository } from '../../domain/friendships/FriendshipRepository';

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
    
  async rejectRequest(friendshipId: string): Promise<Friendship> {
    const friendship = await prisma.friendship.update({
      where: { id: friendshipId },
      data: { status: FriendshipStatus.REJECTED },
    });

    return friendship;
  }

  async blockUser(friendshipId: string): Promise<Friendship> {
    return prisma.friendship.update({
      where: { id: friendshipId },
      data: { status: FriendshipStatus.BLOCKED },
    });
  }

  async getPendingRequests(userId: string): Promise<Friendship[]> {
    return prisma.friendship.findMany({
      where: {
        receiverId: userId,
        status: FriendshipStatus.PENDING,
      },
      include: { requester: true },
    });
  }

  async getAllFriends(userId: string): Promise<Friendship[]> {
    return prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: userId, status: FriendshipStatus.ACCEPTED },
          { receiverId: userId, status: FriendshipStatus.ACCEPTED },
        ],
      },
      include: { requester: true, receiver: true },
    });
  }
}
