import { useEvent } from '@/entities/event';
import { useUser } from '@/entities/user';
import { Button, Skeleton, Stack, Text, Title } from '@mantine/core';
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

  return (
    <>
      {isLoading && <Skeleton visible={isLoading} w={'100%'} h={100} />}
      {!isLoading && event && (
        <Stack>
          <Title order={1}>Событие {event.title}</Title>
          <Text>Описание: {event.description}</Text>
          <p>Время начала: {event.startTime.toLocaleString()}</p>
          <p>Время окончания: {event.endTime.toLocaleString()}</p>
          <p>Создатель: {user?.username ?? 'неизвестно'}</p>
        </Stack>
      )}
      {!isLoading && !event && (
        <Stack>
          <Text>Событие не найдено</Text>
          <Button onClick={() => navigate('/events')}>Назад</Button>
        </Stack>
      )}
    </>
  );
};

EventPage.displayName = 'EventPage';

export { EventPage };
