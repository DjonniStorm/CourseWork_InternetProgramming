const enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
}

const EventStatusData = [
  { label: 'Черновик', value: EventStatus.DRAFT },
  { label: 'Опубликовано', value: EventStatus.PUBLISHED },
  { label: 'Отменено', value: EventStatus.CANCELLED },
] as const;

interface EventRequest {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  ownerId: string;
  status: EventStatus;
}

interface EventResponse {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  ownerId: string;
  createdAt: Date;
  status: EventStatus;
}

export type { EventRequest, EventResponse };

export { EventStatusData, EventStatus };
