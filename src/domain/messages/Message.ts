export type MessageStatus = 'SENT' | 'DELIVERED' | 'READ';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  status: MessageStatus;
  sender?: {
    id: string;
    name: string;
    email: string;
    isOnline: boolean;
  };
  receiver?: {
    id: string;
    name: string;
    email: string;
    isOnline: boolean;
  };
  createdAt: Date;
}
