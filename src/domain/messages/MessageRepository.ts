import { Message } from './Message';

export interface MessageRepository {
  sendMessage(senderId: string, receiverId: string, content: string): Promise<Message>;
  getConversation(userId: string, otherUserId: string): Promise<Message[]>;
  markAsRead(messageId: string): Promise<Message>;
  deleteMessage(messageId: string): Promise<void>;
}
