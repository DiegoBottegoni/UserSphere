import {
  sendRequest,
  acceptRequest,
  rejectFriendRequest,
  blockUser,
  getPendingRequests,
  getSentRequests,
  getAllFriends,
} from '@/features/friendships/friendshipService';
import { prisma } from '@/infrastructure/prisma/client';
import { BadRequestError } from '@/infrastructure/errors/BadRequestError';

describe('FriendshipService Integration Tests', () => {
  let aliceId: string;
  let bobId: string;

  beforeEach(async () => {
    const alice = await prisma.user.create({
      data: {
        name: 'Alice',
        email: `alice-friend-${Date.now()}@test.com`,
        passwordHash: 'hash',
      },
    });
    aliceId = alice.id;

    const bob = await prisma.user.create({
      data: {
        name: 'Bob',
        email: `bob-friend-${Date.now()}@test.com`,
        passwordHash: 'hash',
      },
    });
    bobId = bob.id;
  });

  describe('sendRequest', () => {
    it('should send a friendship request', async () => {
      const friendship = await sendRequest(aliceId, bobId);

      expect(friendship).toHaveProperty('id');
      expect(friendship.requesterId).toBe(aliceId);
      expect(friendship.receiverId).toBe(bobId);
      expect(friendship.status).toBe('PENDING');
    });

    it('should throw BadRequestError if sending request to self', async () => {
      await expect(sendRequest(aliceId, aliceId)).rejects.toThrow(
        BadRequestError
      );
    });
  });

  describe('acceptRequest', () => {
    it('should accept a pending friendship request', async () => {
      const friendship = await sendRequest(aliceId, bobId);

      const accepted = await acceptRequest(friendship.id);

      expect(accepted.status).toBe('ACCEPTED');
    });
  });

  describe('rejectFriendRequest', () => {
    it('should reject and delete a friendship request', async () => {
      const friendship = await sendRequest(aliceId, bobId);

      const result = await rejectFriendRequest(friendship.id);

      expect(result.requesterId).toBe(aliceId);
      expect(result.receiverId).toBe(bobId);
      
      // Verify it was deleted
      const found = await prisma.friendship.findUnique({
        where: { id: friendship.id },
      });
      expect(found).toBeNull();
    });
  });

  describe('blockUser', () => {
    it('should block a user', async () => {
      const friendship = await sendRequest(aliceId, bobId);

      const blocked = await blockUser(friendship.id);

      expect(blocked.status).toBe('BLOCKED');
    });
  });

  describe('getPendingRequests', () => {
    it('should return pending requests for a user', async () => {
      await sendRequest(aliceId, bobId);

      const pending = await getPendingRequests(bobId);

      expect(pending.length).toBeGreaterThanOrEqual(1);
      expect(pending[0]).toBeDefined();
      expect(pending[0]!.status).toBe('PENDING');
      expect(pending[0]!.requester?.id).toBe(aliceId); 
    });
  });

  describe('getSentRequests', () => {
    it('should return sent requests for a user', async () => {
      await sendRequest(aliceId, bobId);

      const sent = await getSentRequests(aliceId);

      expect(sent.length).toBeGreaterThanOrEqual(1);
      expect(sent[0]).toBeDefined();
      expect(sent[0]!.status).toBe('PENDING');
      expect(sent[0]!.receiver?.id).toBe(bobId); 
    });
  });

  describe('getAllFriends', () => {
    it('should return accepted friendships', async () => {
      const friendship = await sendRequest(aliceId, bobId);
      await acceptRequest(friendship.id);

      const friends = await getAllFriends(aliceId);

      expect(friends.length).toBeGreaterThanOrEqual(1);
      expect(friends[0]).toBeDefined();
      expect(friends[0]!.status).toBe('ACCEPTED');
    });

    it('should return empty array if no friends', async () => {
      const friends = await getAllFriends(aliceId);
      expect(friends).toEqual([]);
    });
  });
});
