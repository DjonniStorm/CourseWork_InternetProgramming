import { apiClient } from '@/shared/api/client';
import type { UserCreate, UserLogin, UserResponse, UserUpdate } from '../model/types';

const userApi = {
  getUser: async () => {
    const response = await apiClient.get<UserResponse[]>('/user');
    return response;
  },
  getUserById: async (id: string) => {
    const response = await apiClient.get<UserResponse>(`/user/${id}`);
    return response;
  },
  createUser: async (user: UserCreate) => {
    const response = await apiClient.post('/user', user);
    return response;
  },
  updateUser: async (user: UserUpdate) => {
    const response = await apiClient.put('/user', user);
    return response;
  },
  deleteUser: async (id: string) => {
    const response = await apiClient.delete<void>(`/user/${id}`);
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
