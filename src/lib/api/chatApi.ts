import { fetcher } from './fetcher';

export const chatApi = {
  getConversations: async (userId: string): Promise<any[]> => {
    return fetcher<any[]>(`/api/users/${userId}/conversations`);
  },

  getMessages: async (conversationId: string): Promise<any[]> => {
    return fetcher<any[]>(`/api/chat/${conversationId}/messages`);
  },

  sendMessage: async (conversationId: string, messageData: any): Promise<any> => {
    return fetcher<any>(`/api/chat/${conversationId}/messages`, {
      method: 'POST',
      body: messageData,
    });
  },

  // Add more chat-related API calls
};
