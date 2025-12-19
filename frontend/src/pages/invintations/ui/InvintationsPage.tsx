import {
  InvitationStatus,
  useInvitations,
  useUpdateInvitation,
  type InvitationResponse,
} from '@/entities/invitation';
import { useEvents } from '@/entities/event';
import { useMe } from '@/entities/user';
import { Button, Card, Group, Stack, Title, Text, Skeleton, Badge, Tabs } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useHead } from '@unhead/react';
import { useMemo } from 'react';

const InvintationsPage = () => {
  useHead({
    title: 'Приглашения',
    meta: [
      {
        name: 'description',
        content: 'Страница приглашений',
      },
    ],
  });

  const { data: user } = useMe();
  const { data: invitations, isLoading: invitationsLoading } = useInvitations();
  const { data: events, isLoading: eventsLoading } = useEvents();
  const { mutateAsync: updateInvitation } = useUpdateInvitation();

  const isLoading = invitationsLoading || eventsLoading;

  const eventsMap = useMemo(() => {
    if (!events) return new Map();
    return new Map(events.map((event) => [event.id, event]));
  }, [events]);

  const { received, sent } = useMemo(() => {
    if (!invitations || !user || !eventsMap) {
      return { received: [], sent: [] };
    }

    const receivedInvitations: (InvitationResponse & { eventTitle?: string })[] = [];
    const sentInvitations: (InvitationResponse & { eventTitle?: string })[] = [];

    invitations.forEach((invitation) => {
      const event = eventsMap.get(invitation.eventId);
      const invitationWithEvent = { ...invitation, eventTitle: event?.title };

      if (invitation.userId === user.id) {
        receivedInvitations.push(invitationWithEvent);
      } else if (event?.ownerId === user.id) {
        sentInvitations.push(invitationWithEvent);
      }
    });

    return { received: receivedInvitations, sent: sentInvitations };
  }, [invitations, user, eventsMap]);

  const handleAccept = async (invitation: InvitationResponse) => {
    try {
      await updateInvitation({
        id: invitation.id,
        invitation: {
          eventId: invitation.eventId,
          userId: invitation.userId,
          status: InvitationStatus.ACCEPTED,
        },
      });
      notifications.show({
        title: 'Приглашение принято',
        message: 'Приглашение успешно принято',
        color: 'green',
      });
    } catch (error) {
      console.error(error);
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось принять приглашение',
        color: 'red',
      });
    }
  };

  const handleReject = async (invitation: InvitationResponse) => {
    try {
      await updateInvitation({
        id: invitation.id,
        invitation: {
          eventId: invitation.eventId,
          userId: invitation.userId,
          status: InvitationStatus.REJECTED,
        },
      });
      notifications.show({
        title: 'Приглашение отклонено',
        message: 'Приглашение успешно отклонено',
        color: 'blue',
      });
    } catch (error) {
      console.error(error);
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось отклонить приглашение',
        color: 'red',
      });
    }
  };

  return (
    <Stack gap="xl">
      <Title order={1}>Приглашения</Title>

      {isLoading && (
        <Stack gap="md">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} height={150} />
          ))}
        </Stack>
      )}

      {!isLoading && (
        <Tabs defaultValue="received">
          <Tabs.List>
            <Tabs.Tab value="received">Полученные</Tabs.Tab>
            <Tabs.Tab value="sent">Отправленные</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="received" pt="md">
            <Stack gap="md">
              {received.length === 0 ? (
                <Text c="dimmed">Нет полученных приглашений</Text>
              ) : (
                received.map((invitation) => (
                  <InvitationCard
                    key={invitation.id}
                    invitation={invitation}
                    type="received"
                    onAccept={() => handleAccept(invitation)}
                    onReject={() => handleReject(invitation)}
                  />
                ))
              )}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="sent" pt="md">
            <Stack gap="md">
              {sent.length === 0 ? (
                <Text c="dimmed">Нет отправленных приглашений</Text>
              ) : (
                sent.map((invitation) => (
                  <InvitationCard
                    key={invitation.id}
                    invitation={invitation}
                    type="sent"
                    onReject={() => handleReject(invitation)}
                  />
                ))
              )}
            </Stack>
          </Tabs.Panel>
        </Tabs>
      )}
    </Stack>
  );
};

type InvitationCardProps = {
  invitation: InvitationResponse & { eventTitle?: string };
  type: 'received' | 'sent';
  onAccept?: () => void;
  onReject: () => void;
};

const InvitationCard = ({ invitation, type, onAccept, onReject }: InvitationCardProps) => {
  const statusColor =
    invitation.status === InvitationStatus.ACCEPTED
      ? 'green'
      : invitation.status === InvitationStatus.REJECTED
        ? 'red'
        : 'yellow';

  const statusLabel =
    invitation.status === InvitationStatus.ACCEPTED
      ? 'Принято'
      : invitation.status === InvitationStatus.REJECTED
        ? 'Отклонено'
        : 'Ожидает';

  return (
    <Card withBorder shadow="sm" padding="lg" radius="md">
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs">
            <Text fw={600} size="lg">
              {invitation.eventTitle || `Событие ${invitation.eventId.slice(0, 8)}...`}
            </Text>
            <Text size="sm" c="dimmed">
              Создано: {new Date(invitation.createdAt).toLocaleString('ru-RU')}
            </Text>
          </Stack>
          <Badge color={statusColor} variant="light">
            {statusLabel}
          </Badge>
        </Group>

        {type === 'received' && invitation.status === InvitationStatus.PENDING && (
          <Group>
            <Button color="green" onClick={onAccept}>
              Принять
            </Button>
            <Button color="red" variant="outline" onClick={onReject}>
              Отказаться
            </Button>
          </Group>
        )}

        {type === 'sent' && invitation.status === InvitationStatus.PENDING && (
          <Group>
            <Button color="red" variant="outline" onClick={onReject}>
              Отклонить
            </Button>
          </Group>
        )}
      </Stack>
    </Card>
  );
};

InvintationsPage.displayName = 'InvintationsPage';

export { InvintationsPage };
