import { fetcher } from './fetcher';

export const friendInvitationsApi = {
  getInvitations: async (userId: string, type?: 'sent' | 'received'): Promise<any> => {
    const params = new URLSearchParams({ userId });
    if (type) params.append('type', type);

    return fetcher<any>(`/api/friend-invitations?${params}`);
  },

  sendInvitation: async (fromUserId: string, toUserId: string): Promise<any> => {
    return fetcher<any>('/api/friend-invitations', {
      method: 'POST',
      body: { fromUserId, toUserId },
    });
  },

  respondToInvitation: async (
    invitationId: string,
    action: 'accept' | 'decline',
    userId: string
  ): Promise<any> => {
    return fetcher<any>(`/api/friend-invitations/${invitationId}/respond`, {
      method: 'POST',
      body: { action, userId },
    });
  },

  cancelInvitation: async (invitationId: string, userId: string): Promise<any> => {
    return fetcher<any>(`/api/friend-invitations/${invitationId}`, {
      method: 'DELETE',
      body: { userId },
    });
  },
};
