import { Request, Response } from 'express';
import * as friendshipService from './friendshipService';

export const sendRequest = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { receiverId } = req.params;
    if (!receiverId) return res.status(400).json({ message: 'Missing receiverId parameter' });

    const friendship = await friendshipService.sendRequest(req.user.id, receiverId);
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
    return res.status(200).json(friendship);
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
};

export const rejectFriendRequest = async (req: Request, res: Response) => {
  try {
    const { friendshipId } = req.params;
    if (!friendshipId) return res.status(400).json({ message: 'Missing friendshipId' });

    await friendshipService.rejectFriendRequest(friendshipId);
    return res.status(200).json({ message: 'Friendship and messages deleted successfully' });
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const blockUser = async (req: Request, res: Response) => {
  try {
    const { friendshipId } = req.params;
    if (!friendshipId) return res.status(400).json({ message: 'Missing friendshipId parameter' });

    const friendship = await friendshipService.blockUser(friendshipId);
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
