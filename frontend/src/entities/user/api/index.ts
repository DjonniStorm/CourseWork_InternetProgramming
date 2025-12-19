import { apiClient } from '@/shared/api/client';
import type { UserCreate, UserResponse, UserUpdate } from '../model/types';

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

export { userApi };
