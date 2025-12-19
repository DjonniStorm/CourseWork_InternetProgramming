import { useState } from 'react';
import { useLocation } from 'react-router';
import z from 'zod';

const idSchema = z.uuid();

const EventPage = () => {
  const [id, setId] = useState<string | null>(null);
  const location = useLocation().state;

  if (!idSchema.safeParse(location).success) {
    setId(null);
  } else {
    setId(location);
  }

  return (
    <div>
      <h1>Событие</h1>
    </div>
  );
};

EventPage.displayName = 'EventPage';

export { EventPage };
