import { fetcher } from './fetcher';

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
