import { useUserEvents, type EventResponse } from '@/entities/event';
import { useMe } from '@/entities/user';
import { EventForm } from '@/features/event-form';
import { Button, Card, Group, Stack, Title, Text, SimpleGrid, Skeleton } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useNavigate } from 'react-router';

const EventsPage = () => {
  const { data: user } = useMe();
  const { data: events, isLoading } = useUserEvents(user?.id ?? '');
  const navigate = useNavigate();
  const handleCreateEvent = () => {
    // navigate('/events/create');
    modals.open({
      title: 'Добавить событие',
      children: <EventForm />,
      onSubmit: (values) => {
        console.log(values);
      },
    });
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
            <EventCard key={event.id} event={event} />
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
};

const EventCard = ({ event }: { event: EventResponse }) => {
  return (
    <Card>
      <Title order={2}>{event.title}</Title>
      <Text>{event.description}</Text>
    </Card>
  );
};

EventsPage.displayName = 'EventsPage';

export { EventsPage };
