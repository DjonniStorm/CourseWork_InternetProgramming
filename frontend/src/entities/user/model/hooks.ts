import { useMutation, useQuery } from '@tanstack/react-query';
import { userApi } from '../api';
import type { UserCreate, UserUpdate } from './types';
import { queryClient } from '@/shared/config';

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

export { useUsers, useUser, useCreateUser, useUpdateUser, useDeleteUser };
