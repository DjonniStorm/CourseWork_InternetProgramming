import { EventStatus, type EventResponse } from '@/entities/event';
import { InvitationStatus } from '@/entities/invitation';

export const enum EventState {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  FINISHED = 'FINISHED',
}

export const getEventStatusLabel = (status: EventStatus): string => {
  switch (status) {
    case EventStatus.PUBLISHED:
      return 'Опубликовано';
    case EventStatus.DRAFT:
      return 'Черновик';
    case EventStatus.CANCELLED:
      return 'Отменено';
    default:
      return status;
  }
};

export const getEventStatusColor = (status: EventStatus): string => {
  switch (status) {
    case EventStatus.PUBLISHED:
      return 'green';
    case EventStatus.DRAFT:
      return 'gray';
    case EventStatus.CANCELLED:
      return 'red';
    default:
      return 'blue';
  }
};

export const getEventState = (event: EventResponse): EventState | null => {
  if (event.status === EventStatus.DRAFT || event.status === EventStatus.CANCELLED) {
    return null;
  }

  const now = new Date();
  const startTime = new Date(event.startTime);
  const endTime = new Date(event.endTime);

  if (now < startTime) {
    return EventState.UPCOMING;
  } else if (now >= startTime && now < endTime) {
    return EventState.ONGOING;
  } else {
    return EventState.FINISHED;
  }
};

export const getEventStateLabel = (state: EventState | null): string => {
  if (!state) return '';
  switch (state) {
    case EventState.UPCOMING:
      return 'Предстоящее';
    case EventState.ONGOING:
      return 'Идет';
    case EventState.FINISHED:
      return 'Завершено';
    default:
      return '';
  }
};

export const getEventStateColor = (state: EventState | null): string => {
  if (!state) return 'gray';
  switch (state) {
    case EventState.UPCOMING:
      return 'blue';
    case EventState.ONGOING:
      return 'green';
    case EventState.FINISHED:
      return 'orange';
    default:
      return 'gray';
  }
};

export const getStatusColor = (status: InvitationStatus) => {
  switch (status) {
    case InvitationStatus.ACCEPTED:
      return 'green';
    case InvitationStatus.REJECTED:
      return 'red';
    case InvitationStatus.PENDING:
      return 'yellow';
    default:
      return 'gray';
  }
};

export const getStatusLabel = (status: InvitationStatus) => {
  switch (status) {
    case InvitationStatus.ACCEPTED:
      return 'Принято';
    case InvitationStatus.REJECTED:
      return 'Отклонено';
    case InvitationStatus.PENDING:
      return 'Ожидает';
    default:
      return status;
  }
};
