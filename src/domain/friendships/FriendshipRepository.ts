import { Friendship } from '@prisma/client';

export interface FriendshipRepository {
  sendRequest(requesterId: string, receiverId: string): Promise<Friendship>;
  acceptRequest(friendshipId: string): Promise<Friendship>;
  rejectRequest(friendshipId: string): Promise<Friendship>;
  blockUser(friendshipId: string): Promise<Friendship>;
  getPendingRequests(userId: string): Promise<Friendship[]>;
  getAllFriends(userId: string): Promise<Friendship[]>;
}
