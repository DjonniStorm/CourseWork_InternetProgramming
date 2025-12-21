import { apiClient } from '@/shared/api/client';
import type { UserCreate, UserLogin, UserResponse, UserUpdate } from '../model/types';

const userApi = {
  getUser: async () => {
    const response = await apiClient.get<UserResponse[]>('/user');
    return response;
  },
  getUserById: async (id: string) => {
    const response = await apiClient.get<UserResponse>(`/users/${id}`);
    return response;
  },
  updateUser: async (id: string, user: UserUpdate) => {
    const response = await apiClient.put<UserResponse>(`/users/${id}`, user);
    return response;
  },
  deleteUser: async (id: string) => {
    const response = await apiClient.delete<void>(`/user/${id}`);
    return response;
  },
  searchUsers: async (query: string, page: number = 0, size: number = 20) => {
    const response = await apiClient.get<{
      content: UserResponse[];
      totalElements: number;
      totalPages: number;
      number: number;
      size: number;
    }>(`/users/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`);
    return response;
  },
};

const authApi = {
  login: async (user: UserLogin) => {
    const response = await apiClient.post('/auth/login', user);
    return response;
  },
  register: async (user: UserCreate) => {
    const response = await apiClient.post('/auth/register', user);
    return response;
  },
  logout: async () => {
    const response = await apiClient.post('/auth/logout', {});
    return response;
  },
  refresh: async () => {
    const response = await apiClient.post('/auth/refresh', {});
    return response;
  },
  me: async () => {
    const response = await apiClient.get<UserResponse>('/auth/me');
    return response;
  },
};

export { userApi, authApi };
