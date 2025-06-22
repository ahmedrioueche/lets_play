import { fetcher } from './fetcher';

export const gamesApi = {
  getGames: async (): Promise<any[]> => {
    return fetcher<any[]>('/api/games');
  },

  createGame: async (gameData: any): Promise<any> => {
    return fetcher<any>('/api/games', {
      method: 'POST',
      body: gameData,
    });
  },

  getGameById: async (id: string): Promise<any> => {
    return fetcher<any>(`/api/games/${id}`);
  },

  updateGame: async (id: string, gameData: any): Promise<any> => {
    return fetcher<any>(`/api/games/${id}`, {
      method: 'PUT',
      body: gameData,
    });
  },

  deleteGame: async (id: string): Promise<any> => {
    return fetcher<any>(`/api/games/${id}`, {
      method: 'DELETE',
    });
  },

  registerForGame: async (gameId: string, userId: string): Promise<any> => {
    return fetcher<any>(`/api/games/${gameId}/register`, {
      method: 'POST',
      body: { userId },
    });
  },

  cancelRegistration: async (gameId: string, userId: string): Promise<any> => {
    return fetcher<any>(`/api/games/${gameId}/register`, {
      method: 'DELETE',
      body: { userId },
    });
  },
};

export const authApi = {
  login: async (credentials: any): Promise<any> => {
    return fetcher<any>('/api/auth/login', {
      method: 'POST',
      body: credentials,
    });
  },

  register: async (userData: any): Promise<any> => {
    return fetcher<any>('/api/auth/register', {
      method: 'POST',
      body: userData,
    });
  },
};

export const usersApi = {
  getUserProfile: async (id: string): Promise<any> => {
    return fetcher<any>(`/api/users/${id}`);
  },

  updateUserProfile: async (id: string, userData: any): Promise<any> => {
    return fetcher<any>(`/api/users/${id}`, {
      method: 'PUT',
      body: userData,
    });
  },

  // Add more user-related API calls as needed
};

export const friendsApi = {
  getFriends: async (userId: string): Promise<any[]> => {
    return fetcher<any[]>(`/api/users/${userId}/friends`);
  },

  addFriend: async (userId: string, friendId: string): Promise<any> => {
    return fetcher<any>(`/api/users/${userId}/friends`, {
      method: 'POST',
      body: { friendId },
    });
  },

  removeFriend: async (userId: string, friendId: string): Promise<any> => {
    return fetcher<any>(`/api/users/${userId}/friends/${friendId}`, {
      method: 'DELETE',
    });
  },

  // Add more friend-related API calls
};

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
