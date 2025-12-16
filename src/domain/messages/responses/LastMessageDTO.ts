import { MessageStatus } from '../Message';

export interface LastMessageDTO {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  status: MessageStatus;
  createdAt: Date;
  updatedAt: Date;
  otherUserId: string;
  otherUser?:
    | {
        id: string;
        name: string;
        email: string;
        isOnline: boolean;
      }
    | undefined;
}
