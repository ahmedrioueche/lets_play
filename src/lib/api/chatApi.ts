import { Message } from '@/types/user';
import { fetcher } from './fetcher';

export interface SendMessageData {
  content: string;
  messageType?: 'text' | 'image' | 'file' | 'audio';
  replyTo?: string;
}

export interface TypingStatusData {
  userId: string;
  friendId: string;
  isTyping: boolean;
}

export interface EditMessageData {
  userId: string;
  content: string;
}

export const chatApi = {
  // Get messages for a conversation
  getMessages: async (
    friendId: string,
    userId: string,
    page?: number,
    limit?: number
  ): Promise<Message[]> => {
    const params = new URLSearchParams({ userId });
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    return fetcher<Message[]>(`/api/chat/${friendId}?${params.toString()}`);
  },

  // Send a message
  sendMessage: async (
    friendId: string,
    data: SendMessageData,
    senderId: string
  ): Promise<Message> => {
    try {
      const response = await fetcher<Message>(`/api/chat/${friendId}`, {
        method: 'POST',
        body: { ...data, senderId },
      });

      console.log('chatApi: Message sent successfully:', response);
      return response;
    } catch (error) {
      console.error('chatApi: Error sending message:', error);
      throw error;
    }
  },

  // Send typing status
  sendTypingStatus: async (data: TypingStatusData): Promise<void> => {
    return fetcher<void>('/api/chat/typing', {
      method: 'POST',
      body: data,
    });
  },

  // Get recent conversations
  getRecentConversations: async (userId: string, limit?: number): Promise<any[]> => {
    const params = new URLSearchParams({ userId });
    if (limit) params.append('limit', limit.toString());

    return fetcher<any[]>(`/api/chat/conversations?${params.toString()}`);
  },

  // Edit a message
  editMessage: async (messageId: string, data: EditMessageData): Promise<Message> => {
    return fetcher<Message>(`/api/chat/messages/${messageId}`, {
      method: 'PUT',
      body: data,
    });
  },

  // Delete a message
  deleteMessage: async (messageId: string, userId: string): Promise<void> => {
    return fetcher<void>(`/api/chat/messages/${messageId}?userId=${userId}`, {
      method: 'DELETE',
    });
  },

  // Mark messages as read
  markAsRead: async (userId: string, friendId: string): Promise<void> => {
    return fetcher<void>(`/api/chat/${friendId}/read`, {
      method: 'POST',
      body: { userId },
    });
  },
};
