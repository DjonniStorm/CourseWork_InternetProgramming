import { useUserContacts, ContactRequestStatus } from '@/entities/contact';
import { useInvitations, useCreateInvitation, InvitationStatus } from '@/entities/invitation';
import { useMe } from '@/entities/user';
import { Stack, Skeleton } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useState, useMemo } from 'react';
import { ContactSearchInput } from './ContactSearchInput';
import { ContactInviteList } from './ContactInviteList';

type EventInviteFormProps = {
  eventId: string;
  onInvite: () => void;
};

const EventInviteForm = ({ eventId, onInvite }: EventInviteFormProps) => {
  const { data: currentUser } = useMe();
  const { data: contacts, isLoading: contactsLoading } = useUserContacts(currentUser?.id ?? '');
  const { data: invitations, isLoading: invitationsLoading } = useInvitations();
  const { mutateAsync: createInvitation } = useCreateInvitation();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchQuery, 300);

  const acceptedContacts = useMemo(() => {
    if (!contacts || !currentUser) return [];
    return contacts
      .filter((contact) => contact.status === ContactRequestStatus.ACCEPTED)
      .map((contact) => {
        const contactUserId =
          contact.fromUserId === currentUser.id ? contact.toUserId : contact.fromUserId;
        return { ...contact, contactUserId };
      });
  }, [contacts, currentUser]);

  const alreadyInvitedUserIds = useMemo(() => {
    if (!invitations) return [];
    return invitations
      .filter((invitation) => invitation.eventId === eventId)
      .map((invitation) => invitation.userId);
  }, [invitations, eventId]);

  const availableContacts = useMemo(() => {
    return acceptedContacts.filter(
      (contact) => !alreadyInvitedUserIds.includes(contact.contactUserId),
    );
  }, [acceptedContacts, alreadyInvitedUserIds]);

  const handleInvite = async (userId: string) => {
    try {
      await createInvitation({
        eventId,
        userId,
        status: InvitationStatus.PENDING,
      });
      notifications.show({
        title: 'Приглашение отправлено',
        message: 'Пользователь успешно приглашен на мероприятие',
        color: 'green',
      });
      onInvite();
    } catch (error) {
      console.error(error);
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось отправить приглашение',
        color: 'red',
      });
    }
  };

  const isLoading = contactsLoading || invitationsLoading;

  if (isLoading) {
    return (
      <Stack gap="md">
        <Skeleton height={40} />
        <Skeleton height={200} />
      </Stack>
    );
  }

  return (
    <Stack gap="md">
      <ContactSearchInput value={searchQuery} onChange={setSearchQuery} />

      <ContactInviteList
        contacts={availableContacts}
        onInvite={handleInvite}
        searchQuery={debouncedSearch}
      />
    </Stack>
  );
};

export { EventInviteForm };
