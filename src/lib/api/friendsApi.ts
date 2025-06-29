import { User } from '@/types/user';
import { fetcher } from './fetcher';

export interface FriendsResponse {
  friends: User[];
  friendRequests: any[];
  pendingRequests: string[];
  friendsCount: number;
}

export const friendsApi = {
  getFriends: async (userId: string): Promise<User[]> => {
    const response = await fetcher<FriendsResponse>(`/api/users/${userId}/friends`);
    return response.friends;
  },

  addFriend: async (userId: string, friendId: string): Promise<any> => {
    return fetcher<any>(`/api/users/${userId}/friends`, {
      method: 'POST',
      body: { friendId },
    });
  },

  removeFriend: async (userId: string, friendId: string): Promise<any> => {
    return fetcher<any>(`/api/users/${userId}/friends`, {
      method: 'DELETE',
      body: { friendId, action: 'remove' },
    });
  },

  blockUser: async (userId: string, friendId: string): Promise<any> => {
    return fetcher<any>(`/api/users/${userId}/friends`, {
      method: 'DELETE',
      body: { friendId, action: 'block' },
    });
  },

  // Chat functionality
  getMessages: async (friendId: string, userId: string): Promise<any[]> => {
    return fetcher<any[]>(`/api/chat/${friendId}?userId=${userId}`);
  },

  sendMessage: async (friendId: string, content: string, senderId: string): Promise<any> => {
    return fetcher<any>(`/api/chat/${friendId}`, {
      method: 'POST',
      body: { content, senderId },
    });
  },

  // Add more friend-related API calls
};
