const enum ContactRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

const ContactRequestStatusData = [
  { label: 'Ожидает', value: ContactRequestStatus.PENDING },
  { label: 'Принято', value: ContactRequestStatus.ACCEPTED },
  { label: 'Отклонено', value: ContactRequestStatus.REJECTED },
] as const;

interface ContactRequest {
  createdAt: Date;
  respondedAt: Date | null;
  fromUserId: string;
  toUserId: string;
  status: ContactRequestStatus;
}

interface ContactRequestResponse {
  id: string;
  createdAt: Date;
  respondedAt: Date | null;
  fromUserId: string;
  toUserId: string;
  status: ContactRequestStatus;
}

export type { ContactRequest, ContactRequestResponse };

export { ContactRequestStatusData, ContactRequestStatus };
