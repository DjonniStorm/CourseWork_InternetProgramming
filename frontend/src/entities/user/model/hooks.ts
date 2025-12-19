import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi, userApi } from '../api';
import type { UserCreate, UserLogin, UserUpdate } from './types';
import { queryClient } from '@/shared/config';
import { tokenStorage } from '@/shared/lib/token';

const useUsers = () => {
  const query = useQuery({ queryKey: ['users'], queryFn: () => userApi.getUser() });
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

const useCreateUser = () => {
  const mutation = useMutation({
    mutationFn: (user: UserCreate) => userApi.createUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
  return mutation;
};

const useUpdateUser = () => {
  const mutation = useMutation({
    mutationFn: (user: UserUpdate) => userApi.updateUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
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
      if (data.accessToken) {
        tokenStorage.set(data.accessToken);
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
    mutationFn: () => {
      tokenStorage.remove();
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
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
export {
  useUsers,
  useUser,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useLogin,
  useRegister,
  useLogout,
  useRefresh,
  useMe,
};
