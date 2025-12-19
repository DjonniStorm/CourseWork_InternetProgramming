import { useForm } from '@mantine/form';
import { z } from 'zod';
import { EventStatusData } from '@/entities/event';
import { EventStatus } from '@/entities/event';
import { zod4Resolver } from 'mantine-form-zod-resolver';

const updateEventFormSchema = z.object({
  title: z.string().min(1, 'Название события обязательно'),
  description: z.string().min(1, 'Описание события обязательно'),
  startTime: z.date(),
  endTime: z.date(),
  status: z.enum(EventStatusData.map((status) => status.value)),
});

const useUpdateEventForm = () => {
  return useForm({
    initialValues: {
      title: '',
      description: '',
      startTime: new Date(),
      endTime: new Date(),
      status: EventStatus.DRAFT,
    },
    validate: zod4Resolver(updateEventFormSchema),
  });
};

export { useUpdateEventForm, updateEventFormSchema };
