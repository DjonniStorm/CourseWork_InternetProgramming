const enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

const InvitationStatusData = [
  { label: 'Ожидает', value: InvitationStatus.PENDING },
  { label: 'Принято', value: InvitationStatus.ACCEPTED },
  { label: 'Отклонено', value: InvitationStatus.REJECTED },
] as const;

interface InvitationRequest {
  eventId: string;
  userId: string;
  status: InvitationStatus;
}

interface InvitationResponse {
  id: string;
  eventId: string;
  userId: string;
  createdAt: Date;
  status: InvitationStatus;
}

export type { InvitationRequest, InvitationResponse };

export { InvitationStatusData, InvitationStatus };


