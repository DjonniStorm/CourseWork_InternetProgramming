import { apiClient } from '@/shared/api';
import type { InvitationRequest, InvitationResponse } from '../model/types';

const invitationApi = {
  getInvitations: async () => {
    const response = await apiClient.get<InvitationResponse[]>('/invitations');
    return response;
  },
  getInvitationById: async (id: string) => {
    const response = await apiClient.get<InvitationResponse>(`/invitations/${id}`);
    return response;
  },
  getUserInvitations: async (userId: string) => {
    const response = await apiClient.get<InvitationResponse[]>(`/invitations/user/${userId}`);
    return response;
  },
  createInvitation: async (invitation: InvitationRequest) => {
    const response = await apiClient.post('/invitations', invitation);
    return response;
  },
  updateInvitation: async (id: string, invitation: InvitationRequest) => {
    const response = await apiClient.put(`/invitations/${id}`, invitation);
    return response;
  },
  deleteInvitation: async (id: string) => {
    const response = await apiClient.delete(`/invitations/${id}`);
    return response;
  },
};

export { invitationApi };
