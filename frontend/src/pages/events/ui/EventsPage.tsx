import {
  useCreateEvent,
  useDeleteEvent,
  useUserEvents,
  type EventRequest,
  type EventResponse,
  EventStatus,
  EventStatusData,
} from '@/entities/event';
import { useMe } from '@/entities/user';
import { EventForm } from '@/features/event-form';
import {
  formatDateTime,
  getEventStatusLabel,
  getEventStatusColor,
  getEventState,
  getEventStateLabel,
  getEventStateColor,
} from '@/shared/utils';
import { IconEdit, IconTrash, IconCalendar, IconClock, IconTag } from '@tabler/icons-react';
import {
  Button,
  Card,
  Group,
  Stack,
  Title,
  Text,
  SimpleGrid,
  Skeleton,
  Badge,
  ActionIcon,
  Tooltip,
  Divider,
  Box,
  Select,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router';
import { useHead } from '@unhead/react';
import { useMemo, useState } from 'react';

type SortOrder = 'asc' | 'desc';

const EventsPage = () => {
  useHead({
    title: 'События',
    meta: [
      {
        name: 'description',
        content: 'Страница событий',
      },
    ],
  });
  const { data: user } = useMe();
  const { data: events, isLoading } = useUserEvents(user?.id ?? '');
  const { mutateAsync: createEventMutation } = useCreateEvent();
  const { mutateAsync: deleteEventMutation } = useDeleteEvent();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<EventStatus | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder | null>(null);

  const filteredAndSortedEvents = useMemo(() => {
    if (!events) return [];

    let filtered = events;

    // Фильтр по статусу
    if (statusFilter) {
      filtered = filtered.filter((event) => event.status === statusFilter);
    }

    // Сортировка по дате
    if (sortOrder) {
      filtered = [...filtered].sort((a, b) => {
        const dateA = new Date(a.startTime).getTime();
        const dateB = new Date(b.startTime).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
    }

    return filtered;
  }, [events, statusFilter, sortOrder]);
  const createEvent = async (event: Omit<EventRequest, 'ownerId'>) => {
    try {
      await createEventMutation({ ...event, ownerId: user?.id ?? '' });
      notifications.show({
        title: 'Событие успешно создано',
        message: 'Событие успешно создано',
        color: 'green',
      });
    } catch (error: unknown) {
      console.error(error);
      notifications.show({
        title: 'Ошибка при создании события',
        message: 'Ошибка при создании события',
        color: 'red',
      });
    }
  };
  const handleCreateEvent = () => {
    // navigate('/events/create');
    const id = modals.open({
      title: 'Добавить событие',
      children: (
        <EventForm
          onSubmit={async (values) => {
            await createEvent(values);
            modals.close(id);
          }}
        />
      ),
      onSubmit: (values) => {
        console.log(values);
      },
    });
  };
  const handleEditEvent = (event: EventResponse) => {
    navigate(`/events/${event.id}`);
  };
  const handleDeleteEvent = async (event: EventResponse) => {
    try {
      await deleteEventMutation(event.id);
      notifications.show({
        title: 'Событие успешно удалено',
        message: 'Событие успешно удалено',
        color: 'green',
      });
    } catch (error: unknown) {
      console.error(error);
      notifications.show({
        title: 'Ошибка при удалении события',
        message: 'Ошибка при удалении события',
        color: 'red',
      });
    }
  };
  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Title order={1}>События</Title>
        <Button onClick={handleCreateEvent}>Добавить событие</Button>
      </Group>

      {!isLoading && events && events.length > 0 && (
        <Group gap="md">
          <Select
            placeholder="Фильтр по статусу"
            data={EventStatusData.map((status) => ({ label: status.label, value: status.value }))}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value as EventStatus | null)}
            clearable
            w={200}
          />
          <Select
            placeholder="Сортировка по дате"
            data={[
              { label: 'По возрастанию', value: 'asc' },
              { label: 'По убыванию', value: 'desc' },
            ]}
            value={sortOrder}
            onChange={(value) => setSortOrder(value as SortOrder | null)}
            clearable
            w={200}
          />
        </Group>
      )}

      {isLoading &&
        Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} height={200} />)}
      {!isLoading && events?.length === 0 && <Text>Нет событий</Text>}
      {!isLoading && filteredAndSortedEvents.length === 0 && events && events.length > 0 && (
        <Text>Нет событий, соответствующих выбранным фильтрам</Text>
      )}
      {!isLoading && filteredAndSortedEvents.length > 0 && (
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 5 }}
          spacing={{ base: 10, sm: 'xl' }}
          verticalSpacing={{ base: 'md', sm: 'xl' }}
        >
          {filteredAndSortedEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={() => handleEditEvent(event)}
              onDelete={() => handleDeleteEvent(event)}
            />
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
};

type EventCardProps = {
  event: EventResponse;
  onEdit: () => void;
  onDelete: () => void;
};

const EventCard = ({ event, onEdit, onDelete }: EventCardProps) => {
  const navigate = useNavigate();
  const statusColor = getEventStatusColor(event.status);
  const statusLabel = getEventStatusLabel(event.status);
  const eventState = getEventState(event);
  const stateLabel = eventState ? getEventStateLabel(eventState) : null;
  const stateColor = eventState ? getEventStateColor(eventState) : null;

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, [role="button"]')) {
      return;
    }
    navigate(`/events/${event.id}`);
  };

  return (
    <Card
      withBorder
      shadow="sm"
      padding="lg"
      radius="md"
      style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--mantine-shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--mantine-shadow-sm)';
      }}
      onClick={handleCardClick}
    >
      <Stack gap="md">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Box style={{ flex: 1, minWidth: 0 }}>
            <Title order={3} size="h4" lineClamp={2} mb="xs">
              {event.title}
            </Title>
            <Group gap="xs" mb="xs">
              <Badge
                color={statusColor}
                variant="light"
                leftSection={<IconTag size={12} />}
                size="sm"
              >
                {statusLabel}
              </Badge>
              {stateLabel && stateColor && (
                <Badge color={stateColor as string} variant="light" size="sm">
                  {stateLabel}
                </Badge>
              )}
            </Group>
          </Box>
          <Group gap={4} onClick={(e) => e.stopPropagation()}>
            <Tooltip label="Редактировать">
              <ActionIcon
                variant="subtle"
                color="blue"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              >
                <IconEdit size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Удалить">
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <IconTrash size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>

        {event.description && (
          <Text size="sm" c="dimmed" lineClamp={2}>
            {event.description}
          </Text>
        )}

        <Divider />

        <Stack gap="xs">
          <Group gap="xs" wrap="nowrap">
            <IconCalendar
              size={16}
              style={{ color: 'var(--mantine-color-blue-6)', flexShrink: 0 }}
            />
            <Text size="xs" c="dimmed" truncate>
              {formatDateTime(event.startTime)}
            </Text>
          </Group>
          <Group gap="xs" wrap="nowrap">
            <IconClock
              size={16}
              style={{ color: 'var(--mantine-color-orange-6)', flexShrink: 0 }}
            />
            <Text size="xs" c="dimmed" truncate>
              До {formatDateTime(event.endTime)}
            </Text>
          </Group>
        </Stack>
      </Stack>
    </Card>
  );
};

EventsPage.displayName = 'EventsPage';

export { EventsPage };
