import { useEvent } from '@/entities/event';
import { useUser } from '@/entities/user';
import { formatDateTime, getEventStatusLabel, getEventStatusColor } from '@/shared/utils';
import { EventInvitees } from '@/features/event-invitees';
import {
  Button,
  Skeleton,
  Stack,
  Text,
  Title,
  Card,
  Group,
  Badge,
  Divider,
  Paper,
  Box,
  Grid,
} from '@mantine/core';
import {
  IconCalendar,
  IconClock,
  IconUser,
  IconFileText,
  IconTag,
  IconArrowLeft,
} from '@tabler/icons-react';
import { useHead } from '@unhead/react';
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import z from 'zod';

const idSchema = z.object({
  id: z.uuid(),
});

const EventPage = () => {
  const [id, setId] = useState<string | null>(null);
  const location = useLocation();
  const query = useParams();
  const navigate = useNavigate();
  if (!id && idSchema.safeParse(location.state).success) {
    setId(location.state.id);
  } else if (!id && idSchema.safeParse(query).success) {
    setId(query.id ?? null);
  }

  const { data: event, isLoading } = useEvent(id ?? '');
  useHead({
    title: `Событие: ${event?.title ?? ''}`,
  });
  const { data: user } = useUser(event?.ownerId ?? '');

  if (isLoading) {
    return (
      <Stack gap="md">
        <Skeleton height={60} />
        <Skeleton height={400} />
      </Stack>
    );
  }

  if (!event) {
    return (
      <Stack gap="md" align="center" py="xl">
        <Text size="xl" fw={500} c="dimmed">
          Событие не найдено
        </Text>
        <Button leftSection={<IconArrowLeft size={16} />} onClick={() => navigate('/events')}>
          Вернуться к событиям
        </Button>
      </Stack>
    );
  }

  return (
    <Stack gap="xl">
      <Group>
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate('/events')}
        >
          Назад
        </Button>
      </Group>

      <Grid>
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="lg">
              <Group justify="space-between" align="flex-start">
                <Box style={{ flex: 1 }}>
                  <Title order={1} mb="xs">
                    {event.title}
                  </Title>
                  <Badge
                    color={getEventStatusColor(event.status)}
                    variant="light"
                    leftSection={<IconTag size={14} />}
                    size="lg"
                  >
                    {getEventStatusLabel(event.status)}
                  </Badge>
                </Box>
              </Group>

              <Divider />

              {event.description && (
                <Paper
                  p="md"
                  withBorder
                  radius="md"
                  style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}
                >
                  <Group gap="xs" mb="xs">
                    <IconFileText size={18} style={{ color: 'var(--mantine-color-gray-6)' }} />
                    <Text fw={500} size="sm" c="dimmed">
                      Описание
                    </Text>
                  </Group>
                  <Text size="md">{event.description}</Text>
                </Paper>
              )}

              <Stack gap="md">
                <Group gap="md">
                  <IconCalendar size={20} style={{ color: 'var(--mantine-color-blue-6)' }} />
                  <Box style={{ flex: 1 }}>
                    <Text size="sm" c="dimmed" mb={4}>
                      Время начала
                    </Text>
                    <Text fw={500}>{formatDateTime(event.startTime)}</Text>
                  </Box>
                </Group>

                <Group gap="md">
                  <IconClock size={20} style={{ color: 'var(--mantine-color-blue-6)' }} />
                  <Box style={{ flex: 1 }}>
                    <Text size="sm" c="dimmed" mb={4}>
                      Время окончания
                    </Text>
                    <Text fw={500}>{formatDateTime(event.endTime)}</Text>
                  </Box>
                </Group>

                <Group gap="md">
                  <IconUser size={20} style={{ color: 'var(--mantine-color-blue-6)' }} />
                  <Box style={{ flex: 1 }}>
                    <Text size="sm" c="dimmed" mb={4}>
                      Создатель
                    </Text>
                    <Text fw={500}>{user?.username ?? 'Неизвестный пользователь'}</Text>
                    {user?.email && (
                      <Text size="sm" c="dimmed">
                        {user.email}
                      </Text>
                    )}
                  </Box>
                </Group>
              </Stack>

              <Divider />

              <Group gap="xs">
                <Text size="sm" c="dimmed">
                  Создано:
                </Text>
                <Text size="sm" fw={500}>
                  {formatDateTime(event.createdAt)}
                </Text>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 4 }}>
          <EventInvitees eventId={event.id} />
        </Grid.Col>
      </Grid>
    </Stack>
  );
};

EventPage.displayName = 'EventPage';

export { EventPage };
