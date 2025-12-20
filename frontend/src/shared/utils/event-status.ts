import { EventStatus } from '@/entities/event';
import { InvitationStatus } from '@/entities/invitation';

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
