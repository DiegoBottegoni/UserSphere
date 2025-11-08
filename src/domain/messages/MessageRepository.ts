import { Message } from './Message';
import { LastMessageDTO } from './responses/LastMessageDTO';

export interface MessageRepository {
  sendMessage(senderId: string, receiverId: string, content: string): Promise<Message>;
  getConversation(userId: string, otherUserId: string): Promise<Message[]>;
  getLastMessages(userId: string): Promise<LastMessageDTO[]>;
  markAsRead(messageId: string): Promise<Message>;
  findById(messageId: string): Promise<Message | null>;
  deleteMessage(messageId: string): Promise<void>;
}
