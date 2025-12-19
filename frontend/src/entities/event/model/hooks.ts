import { useMutation, useQuery } from '@tanstack/react-query';
import { eventApi } from '../api';
import type { EventRequest } from './types';
import { queryClient } from '@/shared/config';

const useEvents = () => {
  return useQuery({ queryKey: ['events'], queryFn: () => eventApi.getEvents() });
};

const useEvent = (id: string) => {
  return useQuery({ queryKey: ['event', id], queryFn: () => eventApi.getEventById(id) });
};

const useUserEvents = (userId: string) => {
  return useQuery({
    queryKey: ['userEvents', userId],
    queryFn: () => eventApi.getUserEvents(userId),
  });
};

const useCreateEvent = () => {
  return useMutation({
    mutationFn: (event: EventRequest) => eventApi.createEvent(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['userEvents'] });
    },
  });
};

const useUpdateEvent = () => {
  return useMutation({
    mutationFn: ({ id, event }: { id: string; event: EventRequest }) =>
      eventApi.updateEvent(id, event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

const useDeleteEvent = () => {
  return useMutation({
    mutationFn: (id: string) => eventApi.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userEvents'] });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['userEvents'] });
    },
  });
};

export { useEvents, useEvent, useUserEvents, useCreateEvent, useUpdateEvent, useDeleteEvent };
