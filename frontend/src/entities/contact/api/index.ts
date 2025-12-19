import { apiClient } from '@/shared/api';
import type { ContactRequest, ContactRequestResponse } from '../model/types';

const contactApi = {
  getContacts: async () => {
    const response = await apiClient.get<ContactRequestResponse[]>('/contacts');
    return response;
  },
  getContactById: async (id: string) => {
    const response = await apiClient.get<ContactRequestResponse>(`/contacts/${id}`);
    return response;
  },
  getUserContacts: async (userId: string) => {
    const response = await apiClient.get<ContactRequestResponse[]>(`/contacts/user/${userId}`);
    return response;
  },
  createContact: async (contact: ContactRequest) => {
    const response = await apiClient.post('/contacts', contact);
    return response;
  },
  updateContact: async (id: string, contact: ContactRequest) => {
    const response = await apiClient.put(`/contacts/${id}`, contact);
    return response;
  },
  deleteContact: async (id: string) => {
    const response = await apiClient.delete(`/contacts/${id}`);
    return response;
  },
};

export { contactApi };
