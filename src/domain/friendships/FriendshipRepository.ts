import { Friendship } from '@prisma/client';
import { FriendshipUserPreview } from './dtos/FriendshipUserPreview';

export type FriendshipWithRelations = Friendship & {
  requester?: FriendshipUserPreview;
  receiver?: FriendshipUserPreview;
};

export interface FriendshipRepository {
  sendRequest(requesterId: string, receiverId: string): Promise<Friendship>;
  acceptRequest(friendshipId: string): Promise<Friendship>;
  rejectRequest(friendshipId: string): Promise<{ requesterId: string; receiverId: string }>;
  blockUser(friendshipId: string): Promise<Friendship>;
  getPendingRequests(userId: string): Promise<FriendshipWithRelations[]>;
  getSentRequests(userId: string): Promise<FriendshipWithRelations[]>;
  getAllFriends(userId: string): Promise<FriendshipWithRelations[]>;
}
