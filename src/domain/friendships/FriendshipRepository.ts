import { Friendship } from '@prisma/client';
import { FriendshipPreview } from './dtos/FriendshipPreview';

export interface FriendshipRepository {
  sendRequest(requesterId: string, receiverId: string): Promise<Friendship>;
  acceptRequest(friendshipId: string): Promise<Friendship>;
  rejectRequest(friendshipId: string): Promise<void>;
  blockUser(friendshipId: string): Promise<Friendship>;
  getPendingRequests(userId: string): Promise<FriendshipPreview[]>;
  getSentRequests(userId: string): Promise<FriendshipPreview[]>;
  getAllFriends(userId: string): Promise<FriendshipPreview[]>;
}
