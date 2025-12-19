import {
  EventStatus,
  useCreateEvent,
  useDeleteEvent,
  useUserEvents,
  type EventRequest,
  type EventResponse,
} from '@/entities/event';
import { useMe } from '@/entities/user';
import { EventForm } from '@/features/event-form';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import {
  Button,
  Card,
  Group,
  Stack,
  Title,
  Text,
  SimpleGrid,
  Skeleton,
  Pill,
  ActionIcon,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router';
import { useHead } from '@unhead/react';

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
      {isLoading &&
        Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} height={200} />)}
      {!isLoading && events?.length === 0 && <Text>Нет событий</Text>}
      {!isLoading && events?.length && events.length > 0 && (
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 5 }}
          spacing={{ base: 10, sm: 'xl' }}
          verticalSpacing={{ base: 'md', sm: 'xl' }}
        >
          {events?.map((event) => (
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
  return (
    <Card>
      <Group justify="space-between">
        <Stack>
          <Title order={2}>{event.title}</Title>
          <Text>{event.description}</Text>
          <Pill
            ta="center"
            color={
              event.status === EventStatus.DRAFT
                ? 'gray'
                : event.status === EventStatus.PUBLISHED
                  ? 'green'
                  : 'red'
            }
          >
            {event.status}
          </Pill>
        </Stack>
        <Stack>
          <ActionIcon onClick={onEdit}>
            <IconEdit />
          </ActionIcon>
          <ActionIcon bg="red" onClick={onDelete}>
            <IconTrash />
          </ActionIcon>
        </Stack>
      </Group>
    </Card>
  );
};

EventsPage.displayName = 'EventsPage';

export { EventsPage };
