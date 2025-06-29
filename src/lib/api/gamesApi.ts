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
