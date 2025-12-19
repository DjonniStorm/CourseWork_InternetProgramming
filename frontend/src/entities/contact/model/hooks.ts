import { useMutation, useQuery } from '@tanstack/react-query';
import { contactApi } from '../api';
import type { ContactRequest } from './types';
import { queryClient } from '@/shared/config';

const useContacts = () => {
  return useQuery({ queryKey: ['contacts'], queryFn: () => contactApi.getContacts() });
};

const useContact = (id: string) => {
  return useQuery({ queryKey: ['contact', id], queryFn: () => contactApi.getContactById(id) });
};

const useUserContacts = (userId: string) => {
  return useQuery({
    queryKey: ['userContacts', userId],
    queryFn: () => contactApi.getUserContacts(userId),
  });
};

const useCreateContact = () => {
  return useMutation({
    mutationFn: (contact: ContactRequest) => contactApi.createContact(contact),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['userContacts'] });
    },
  });
};

const useUpdateContact = () => {
  return useMutation({
    mutationFn: ({ id, contact }: { id: string; contact: ContactRequest }) =>
      contactApi.updateContact(id, contact),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
};

const useDeleteContact = () => {
  return useMutation({
    mutationFn: (id: string) => contactApi.deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userContacts'] });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['userContacts'] });
    },
  });
};

export {
  useContacts,
  useContact,
  useUserContacts,
  useCreateContact,
  useUpdateContact,
  useDeleteContact,
};
