import { useMutation, useQuery } from '@tanstack/react-query';
import { invitationApi } from '../api';
import type { InvitationRequest } from './types';
import { queryClient } from '@/shared/config';

const useInvitations = () => {
  return useQuery({ queryKey: ['invitations'], queryFn: () => invitationApi.getInvitations() });
};

const useInvitation = (id: string) => {
  return useQuery({
    queryKey: ['invitation', id],
    queryFn: () => invitationApi.getInvitationById(id),
  });
};

const useUserInvitations = (userId: string) => {
  return useQuery({
    queryKey: ['userInvitations', userId],
    queryFn: () => invitationApi.getUserInvitations(userId),
  });
};

const useCreateInvitation = () => {
  return useMutation({
    mutationFn: (invitation: InvitationRequest) => invitationApi.createInvitation(invitation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      queryClient.invalidateQueries({ queryKey: ['userInvitations'] });
      queryClient.invalidateQueries({ queryKey: ['invitedEvents'] });
    },
  });
};

const useUpdateInvitation = () => {
  return useMutation({
    mutationFn: ({ id, invitation }: { id: string; invitation: InvitationRequest }) =>
      invitationApi.updateInvitation(id, invitation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      queryClient.invalidateQueries({ queryKey: ['userInvitations'] });
      queryClient.invalidateQueries({ queryKey: ['invitedEvents'] });
    },
  });
};

const useDeleteInvitation = () => {
  return useMutation({
    mutationFn: (id: string) => invitationApi.deleteInvitation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      queryClient.invalidateQueries({ queryKey: ['userInvitations'] });
      queryClient.invalidateQueries({ queryKey: ['invitedEvents'] });
    },
  });
};

export {
  useInvitations,
  useInvitation,
  useUserInvitations,
  useCreateInvitation,
  useUpdateInvitation,
  useDeleteInvitation,
};
