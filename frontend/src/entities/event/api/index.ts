import { apiClient } from '@/shared/api';
import type { EventRequest, EventResponse } from '../model/types';

const eventApi = {
  getEvents: async () => {
    const response = await apiClient.get<EventResponse[]>('/events');
    return response;
  },
  getEventById: async (id: string) => {
    const response = await apiClient.get<EventResponse>(`/events/${id}`);
    return response;
  },
  getUserEvents: async (userId: string) => {
    const response = await apiClient.get<EventResponse[]>(`/events/user/${userId}`);
    return response;
  },
  getInvitedEvents: async (userId: string) => {
    const response = await apiClient.get<EventResponse[]>(`/events/invited/${userId}`);
    return response;
  },
  createEvent: async (event: EventRequest) => {
    const response = await apiClient.post('/events', event);
    return response;
  },
  updateEvent: async (id: string, event: EventRequest) => {
    const response = await apiClient.put(`/events/${id}`, event);
    return response;
  },
  deleteEvent: async (id: string) => {
    const response = await apiClient.delete(`/events/${id}`);
    return response;
  },
};

export { eventApi };
