import { Request, Response } from 'express';
import * as friendshipService from '@/features/friendships/friendshipService';
import { io } from '@/server';
import { connectedUsers } from '@/infrastructure/socket/connectedUsers';

export const sendRequest = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { receiverId } = req.params;

    if (!receiverId) return res.status(400).json({ message: 'Missing receiverId parameter' });

    const friendship = await friendshipService.sendRequest(req.user.id, receiverId);

    const receiverSocket = connectedUsers.get(receiverId);
    if (receiverSocket) io.to(receiverSocket).emit('friend:request:received', friendship);

    const senderSocket = connectedUsers.get(req.user.id);
    if (senderSocket) io.to(senderSocket).emit('friend:request:sent', friendship);

    return res.status(201).json(friendship);
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
};

export const acceptRequest = async (req: Request, res: Response) => {
  try {
    const { friendshipId } = req.params;
    if (!friendshipId) return res.status(400).json({ message: 'Missing friendshipId parameter' });

    const friendship = await friendshipService.acceptRequest(friendshipId);

    const { requesterId, receiverId } = friendship;

    const s1 = connectedUsers.get(requesterId);
    const s2 = connectedUsers.get(receiverId);

    if (s1) io.to(s1).emit('friend:accepted', friendship);
    if (s2) io.to(s2).emit('friend:accepted', friendship);

    return res.status(200).json(friendship);
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
};

export const rejectFriendRequest = async (req: Request, res: Response) => {
  try {
    const { friendshipId } = req.params;
    if (!friendshipId) return res.status(400).json({ message: 'Missing friendshipId parameter' });

    const result = await friendshipService.rejectFriendRequest(friendshipId);

    const { requesterId, receiverId } = result;

    const s1 = connectedUsers.get(requesterId);
    const s2 = connectedUsers.get(receiverId);

    if (s1) io.to(s1).emit('friend:rejected', { friendshipId });
    if (s2) io.to(s2).emit('friend:rejected', { friendshipId });

    return res.status(200).json({ message: 'Friendship and messages deleted successfully' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Internal server error', error: (error as Error).message });
  }
};

export const blockUser = async (req: Request, res: Response) => {
  try {
    const { friendshipId } = req.params;
    if (!friendshipId) return res.status(400).json({ message: 'Missing friendshipId parameter' });

    const friendship = await friendshipService.blockUser(friendshipId);

    const { requesterId, receiverId } = friendship;

    const s1 = connectedUsers.get(requesterId);
    const s2 = connectedUsers.get(receiverId);

    if (s1) io.to(s1).emit('friend:blocked', friendship);
    if (s2) io.to(s2).emit('friend:blocked', friendship);

    return res.status(200).json(friendship);
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
};

export const getPendingRequests = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const pending = await friendshipService.getPendingRequests(req.user.id);

    return res.status(200).json(pending);
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
};

export const getSentRequests = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const sent = await friendshipService.getSentRequests(req.user.id);

    return res.status(200).json(sent);
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
};

export const getAllFriends = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const friends = await friendshipService.getAllFriends(req.user.id);

    return res.status(200).json(friends);
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
};
