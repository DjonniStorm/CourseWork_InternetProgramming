import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi, userApi } from '../api';
import type { UserCreate, UserLogin, UserUpdate } from './types';
import { queryClient } from '@/shared/config';
import { tokenStorage } from '@/shared/lib/token';

const useUsers = () => {
  const query = useQuery({ queryKey: ['users'], queryFn: () => userApi.getAllUsers() });
  return query;
};

const useUser = (id: string) => {
  const query = useQuery({
    queryKey: ['user', id],
    queryFn: () => userApi.getUserById(id),
    enabled: !!id,
  });
  return query;
};

const useUpdateUser = () => {
  const mutation = useMutation({
    mutationFn: ({ id, user }: { id: string; user: UserUpdate }) => userApi.updateUser(id, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
  return mutation;
};

const useDeleteUser = () => {
  const mutation = useMutation({
    mutationFn: (id: string) => userApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
  return mutation;
};

const useLogin = () => {
  const mutation = useMutation({
    mutationFn: (user: UserLogin) => authApi.login(user),
    onSuccess: (data) => {
      if (typeof data === 'object' && data !== null && 'accessToken' in data) {
        tokenStorage.set(data.accessToken as string);
      }
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
  return mutation;
};

const useRegister = () => {
  const mutation = useMutation({
    mutationFn: (user: UserCreate) => authApi.register(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
  return mutation;
};

const useLogout = () => {
  const mutation = useMutation({
    mutationFn: async () => {
      // Вызываем API для удаления refresh token cookie на сервере
      try {
        await authApi.logout();
      } catch (error) {
        // Игнорируем ошибки, так как мы все равно очищаем токены локально
        console.error('Logout API error:', error);
      }
      // Удаляем access token из localStorage
      tokenStorage.remove();
    },
    onSuccess: () => {
      // Очищаем все кэшированные запросы
      queryClient.clear();
    },
  });
  return mutation;
};

const useRefresh = () => {
  const mutation = useMutation({
    mutationFn: () => authApi.refresh(),
    onSuccess: (data) => {
      if (
        typeof data === 'object' &&
        data &&
        'accessToken' in data &&
        data.accessToken &&
        typeof data.accessToken === 'string'
      ) {
        tokenStorage.set(data.accessToken);
      }
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
  return mutation;
};

const useMe = () => {
  const query = useQuery({
    queryKey: ['me'],
    queryFn: () => authApi.me(),
    enabled: tokenStorage.has(),
    retry: false,
  });
  return query;
};

const useSearchUsers = (
  query: string,
  page: number = 0,
  size: number = 20,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ['searchUsers', query, page, size],
    queryFn: () => userApi.searchUsers(query, page, size),
    enabled: enabled && query.length >= 2,
    retry: false,
  });
};
export {
  useUsers,
  useUser,
  useUpdateUser,
  useDeleteUser,
  useLogin,
  useRegister,
  useLogout,
  useRefresh,
  useMe,
  useSearchUsers,
};
