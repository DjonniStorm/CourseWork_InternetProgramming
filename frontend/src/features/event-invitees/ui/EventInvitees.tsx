import { useInvitations, type InvitationResponse } from '@/entities/invitation';
import { useUser } from '@/entities/user';
import { getStatusColor, getStatusLabel, nameToColor } from '@/shared/utils';
import { EventInviteForm } from '@/features/event-invite-form';
import {
  Card,
  Stack,
  Text,
  Title,
  Group,
  Avatar as MantineAvatar,
  Badge,
  Skeleton,
  Button,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconUsers, IconUserPlus } from '@tabler/icons-react';
import { useMemo } from 'react';

type EventInviteesProps = {
  eventId: string;
};

const EventInvitees = ({ eventId }: EventInviteesProps) => {
  const { data: invitations, isLoading } = useInvitations();

  const eventInvitations = useMemo(() => {
    if (!invitations) {
      return [];
    }
    return invitations.filter((invitation) => invitation.eventId === eventId);
  }, [invitations, eventId]);

  const handleInviteClick = () => {
    modals.open({
      title: 'Пригласить пользователей',
      children: (
        <EventInviteForm
          eventId={eventId}
          onInvite={() => {
            modals.closeAll();
          }}
        />
      ),
    });
  };

  if (isLoading) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Skeleton height={30} />
          <Skeleton height={60} />
          <Skeleton height={60} />
        </Stack>
      </Card>
    );
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <IconUsers size={20} style={{ color: 'var(--mantine-color-blue-6)' }} />
            <Title order={3}>Приглашенные</Title>
            <Badge variant="light" size="lg">
              {eventInvitations.length}
            </Badge>
          </Group>
          <Button
            leftSection={<IconUserPlus size={16} />}
            size="sm"
            variant="light"
            onClick={handleInviteClick}
          >
            Пригласить
          </Button>
        </Group>

        {eventInvitations.length === 0 ? (
          <Text c="dimmed" size="sm">
            Нет приглашенных пользователей
          </Text>
        ) : (
          <Stack gap="sm">
            {eventInvitations.map((invitation) => (
              <InviteeItem key={invitation.id} invitation={invitation} />
            ))}
          </Stack>
        )}
      </Stack>
    </Card>
  );
};

type InviteeItemProps = {
  invitation: InvitationResponse;
};

const InviteeItem = ({ invitation }: InviteeItemProps) => {
  const { data: user, isLoading } = useUser(invitation.userId);

  if (isLoading) {
    return <Skeleton height={50} />;
  }

  const userName = user?.username || invitation.userId.slice(0, 8);

  return (
    <Group gap="sm" align="center">
      <MantineAvatar name={userName} color={nameToColor(userName)} size="md" />
      <Stack gap={2} style={{ flex: 1 }}>
        <Text fw={500} size="sm">
          {user?.username || 'Неизвестный пользователь'}
        </Text>
        {user?.email && (
          <Text size="xs" c="dimmed">
            {user.email}
          </Text>
        )}
      </Stack>
      <Badge color={getStatusColor(invitation.status)} variant="light" size="sm">
        {getStatusLabel(invitation.status)}
      </Badge>
    </Group>
  );
};

export { EventInvitees };
