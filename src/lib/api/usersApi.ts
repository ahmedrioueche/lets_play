import { fetcher } from './fetcher';

export const usersApi = {
  updateUser: async (userId: string, updateData: any): Promise<any> => {
    return fetcher<any>(`/api/users/${userId}`, {
      method: 'PATCH',
      body: updateData,
    });
  },

  getUserProfile: async (userId: string): Promise<any> => {
    return fetcher<any>(`/api/users/${userId}`);
  },

  getUserById: async (userId: string): Promise<any> => {
    return fetcher<any>(`/api/users/${userId}/basic`);
  },

  updateUserProfile: async (userId: string, updateData: any): Promise<any> => {
    return fetcher<any>(`/api/users/${userId}/user-profile`, {
      method: 'PATCH',
      body: updateData,
    });
  },

  // Delete user and all related data
  deleteUser: async (userId: string): Promise<any> => {
    return fetcher<any>(`/api/users/${userId}`, {
      method: 'DELETE',
      body: { confirmation: 'DELETE_MY_ACCOUNT' },
    });
  },

  // Utility function to delete current user and handle logout
  deleteCurrentUser: async (userId: string): Promise<any> => {
    try {
      const result = await usersApi.deleteUser(userId);

      // Clear auth cookie and redirect to login
      if (typeof window !== 'undefined') {
        // Clear any local storage or session storage
        localStorage.clear();
        sessionStorage.clear();

        // Redirect to login page
        window.location.href = '/auth/login';
      }

      return result;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Add more user-related API calls as needed
};
