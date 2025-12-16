import {
  sendMessage,
  getConversation,
  getLastMessages,
  markAsRead,
  deleteMessage,
} from '@/features/messages/messageService';
import { prisma } from '@/infrastructure/prisma/client';
import { BadRequestError } from '@/infrastructure/errors/BadRequestError';
import { UnauthorizedError } from '@/infrastructure/errors/UnauthorizedError';

describe('MessageService Integration Tests', () => {
  let aliceId: string;
  let bobId: string;

  beforeEach(async () => {
    // Create test users
    const alice = await prisma.user.create({
      data: {
        name: 'Alice',
        email: `alice-msg-${Date.now()}@test.com`,
        passwordHash: 'hash',
      },
    });
    aliceId = alice.id;

    const bob = await prisma.user.create({
      data: {
        name: 'Bob',
        email: `bob-msg-${Date.now()}@test.com`,
        passwordHash: 'hash',
      },
    });
    bobId = bob.id;
  });

  describe('sendMessage', () => {
    it('should send a message from Alice to Bob', async () => {
      const message = await sendMessage(aliceId, bobId, 'Hello Bob!');

      expect(message).toHaveProperty('id');
      expect(message.senderId).toBe(aliceId);
      expect(message.receiverId).toBe(bobId);
      expect(message.content).toBe('Hello Bob!');
      expect(message.status).toBe('SENT');
    });
  });

  describe('getConversation', () => {
    it('should retrieve messages between Alice and Bob', async () => {
      await sendMessage(aliceId, bobId, 'Hi Bob');
      await sendMessage(bobId, aliceId, 'Hi Alice');
      await sendMessage(aliceId, bobId, 'How are you?');

      const messages = await getConversation(aliceId, bobId);

      expect(messages).toHaveLength(3);
      expect(messages[0]).toBeDefined();
      expect(messages[2]).toBeDefined();
      expect(messages[0]!.content).toBe('Hi Bob');
      expect(messages[2]!.content).toBe('How are you?');
    });

    it('should return empty array if no messages exist', async () => {
      const messages = await getConversation(aliceId, bobId);
      expect(messages).toEqual([]);
    });
  });

  describe('getLastMessages', () => {
    it('should return last message per conversation', async () => {
      // Alice sends to Bob
      await sendMessage(aliceId, bobId, 'Message 1');
      await sendMessage(aliceId, bobId, 'Message 2');

      // Create another user for a different conversation
      const charlie = await prisma.user.create({
        data: {
          name: 'Charlie',
          email: `charlie-${Date.now()}@test.com`,
          passwordHash: 'hash',
        },
      });

      await sendMessage(aliceId, charlie.id, 'Hi Charlie');

      const lastMessages = await getLastMessages(aliceId);

      expect(lastMessages.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('markAsRead', () => {
    it('should mark message as read by receiver', async () => {
      const message = await sendMessage(aliceId, bobId, 'Test message');

      const updated = await markAsRead(message.id, bobId);

      expect(updated.status).toBe('READ');
    });

    it('should throw BadRequestError if sender tries to mark own message', async () => {
      const message = await sendMessage(aliceId, bobId, 'Test');

      await expect(markAsRead(message.id, aliceId)).rejects.toThrow(
        BadRequestError
      );
    });

    it('should throw UnauthorizedError if unauthorized user tries to mark', async () => {
      const message = await sendMessage(aliceId, bobId, 'Test');

      const charlie = await prisma.user.create({
        data: {
          name: 'Charlie',
          email: `charlie-unauth-${Date.now()}@test.com`,
          passwordHash: 'hash',
        },
      });

      await expect(markAsRead(message.id, charlie.id)).rejects.toThrow(
        UnauthorizedError
      );
    });
  });

  describe('deleteMessage', () => {
    it('should delete a message', async () => {
      const message = await sendMessage(aliceId, bobId, 'To be deleted');

      await deleteMessage(message.id);

      const found = await prisma.message.findUnique({
        where: { id: message.id },
      });
      expect(found).toBeNull();
    });
  });
});
