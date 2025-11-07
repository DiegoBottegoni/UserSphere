import { FriendshipRepositoryPrisma } from '../../infrastructure/friendships/FriendshipRepositoryPrisma';

const friendshipRepository = new FriendshipRepositoryPrisma();

export const sendRequest = async (requesterId: string, receiverId: string) => {
  if (requesterId === receiverId) {
    throw new Error('You cannot send a friendship request to yourself.');
  }
  return friendshipRepository.sendRequest(requesterId, receiverId);
};

export const acceptRequest = async (friendshipId: string) => {
  return friendshipRepository.acceptRequest(friendshipId);
};

// export const rejectFriendRequest = async (friendshipId: string) => {
//   return friendshipRepository.rejectRequest(friendshipId);
// };

export const rejectFriendRequest = async (friendshipId: string): Promise<void> => {
  await friendshipRepository.rejectRequest(friendshipId);
};

export const blockUser = async (friendshipId: string) => {
  return friendshipRepository.blockUser(friendshipId);
};

export const getPendingRequests = async (userId: string) => {
  return friendshipRepository.getPendingRequests(userId);
};

export const getSentRequests = async (userId: string) => {
  return friendshipRepository.getSentRequests(userId);
};

export const getAllFriends = async (userId: string) => {
  return friendshipRepository.getAllFriends(userId);
};
