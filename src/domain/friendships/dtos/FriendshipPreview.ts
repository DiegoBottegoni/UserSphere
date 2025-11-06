import { FriendshipUserPreview } from './FriendshipUserPreview';
import { FriendshipStatus } from '@prisma/client';

export interface FriendshipPreview {
  id: string;
  status: FriendshipStatus;
  friend: FriendshipUserPreview;
}
