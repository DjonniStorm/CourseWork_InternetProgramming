import {
  InvitationStatus,
  InvitationStatusData,
  useInvitations,
  useUpdateInvitation,
  useDeleteInvitation,
  type InvitationResponse,
} from '@/entities/invitation';
import { useEvents } from '@/entities/event';
import { useMe, useUser } from '@/entities/user';
import {
  Button,
  Card,
  Group,
  Stack,
  Title,
  Text,
  Skeleton,
  Badge,
  Tabs,
  Select,
  SimpleGrid,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useHead } from '@unhead/react';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { useQueryFilter } from '@/shared/lib/use-query-filters';

type InvitationWithEvent = InvitationResponse & { eventTitle?: string };

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
  const { mutateAsync: deleteInvitation } = useDeleteInvitation();

  const [sentStatusFilter, setSentStatusFilter] = useQueryFilter<InvitationStatus>({
    paramName: 'status',
    validValues: InvitationStatusData.map((s) => s.value),
  });

  const isLoading = invitationsLoading || eventsLoading;

  const eventsMap = useMemo(() => {
    if (!events) {
      return new Map();
    }
    return new Map(events.map((event) => [event.id, event]));
  }, [events]);

  const { received, sent } = useMemo(() => {
    if (!invitations || !user || !eventsMap) {
      return { received: [], sent: [] };
    }

    const receivedInvitations: InvitationWithEvent[] = [];
    const sentInvitations: InvitationWithEvent[] = [];

    invitations.forEach((invitation) => {
      const event = eventsMap.get(invitation.eventId);
      const invitationWithEvent: InvitationWithEvent = { ...invitation, eventTitle: event?.title };

      if (invitation.userId === user.id) {
        receivedInvitations.push(invitationWithEvent);
      } else if (event?.ownerId === user.id) {
        sentInvitations.push(invitationWithEvent);
      }
    });

    return { received: receivedInvitations, sent: sentInvitations };
  }, [invitations, user, eventsMap]);

  const filteredSent = useMemo(() => {
    if (!sentStatusFilter) {
      return sent;
    }
    return sent.filter((invitation) => invitation.status === sentStatusFilter);
  }, [sent, sentStatusFilter]);

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

  const handleDelete = async (invitation: InvitationResponse) => {
    try {
      await deleteInvitation(invitation.id);
      notifications.show({
        title: 'Приглашение удалено',
        message: 'Приглашение успешно удалено',
        color: 'green',
      });
    } catch (error) {
      console.error(error);
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось удалить приглашение',
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
            {received.length === 0 ? (
              <Text c="dimmed">Нет полученных приглашений</Text>
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
                {received.map((invitation) => (
                  <InvitationCard
                    key={invitation.id}
                    invitation={invitation}
                    type="received"
                    onAccept={() => handleAccept(invitation)}
                    onReject={() => handleReject(invitation)}
                  />
                ))}
              </SimpleGrid>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="sent" pt="md">
            <Stack gap="md">
              <Group justify="space-between">
                <Select
                  placeholder="Фильтр по статусу"
                  data={InvitationStatusData}
                  value={sentStatusFilter}
                  onChange={(value) => setSentStatusFilter(value as InvitationStatus | null)}
                  clearable
                  w={250}
                />
              </Group>
              {filteredSent.length === 0 ? (
                <Text c="dimmed">Нет отправленных приглашений</Text>
              ) : (
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
                  {filteredSent.map((invitation) => (
                    <InvitationCard
                      key={invitation.id}
                      invitation={invitation}
                      type="sent"
                      onDelete={() => handleDelete(invitation)}
                    />
                  ))}
                </SimpleGrid>
              )}
            </Stack>
          </Tabs.Panel>
        </Tabs>
      )}
    </Stack>
  );
};

type InvitationCardProps = {
  invitation: InvitationWithEvent;
  type: 'received' | 'sent';
  onAccept?: () => void;
  onReject?: () => void;
  onDelete?: () => void;
};

const InvitationCard = ({
  invitation,
  type,
  onAccept,
  onReject,
  onDelete,
}: InvitationCardProps) => {
  const { data: user } = useUser(invitation.userId);
  const userName = user?.username || invitation.userId.slice(0, 8);

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
              {type === 'received' ? (
                <Text fw={600} size="lg">
                  {userName} приглашает вас на событие{' '}
                  {invitation.eventTitle || `Событие ${invitation.eventId.slice(0, 8)}...`}
                </Text>
              ) : (
                <Text fw={600} size="lg">
                  Вы пригласили {userName} на событие{' '}
                  {invitation.eventTitle || `Событие ${invitation.eventId.slice(0, 8)}...`}
                </Text>
              )}
            </Text>
            <Text size="sm" c="dimmed">
              Создано: {dayjs(invitation.createdAt).format('DD.MM.YYYY HH:mm')}
            </Text>
          </Stack>
          <Stack gap="xs" align="center">
            <Badge color={statusColor} variant="light">
              {statusLabel}
            </Badge>
            {type === 'sent' && onDelete && (
              <Tooltip label="Удалить приглашение">
                <ActionIcon color="red" variant="subtle" onClick={onDelete}>
                  <IconX size={18} />
                </ActionIcon>
              </Tooltip>
            )}
          </Stack>
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
      </Stack>
    </Card>
  );
};

InvintationsPage.displayName = 'InvintationsPage';

export { InvintationsPage };
