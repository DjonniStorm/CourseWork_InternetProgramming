import { EventStatus, EventStatusData } from '@/entities/event';
import { useForm } from '@mantine/form';
import { z } from 'zod';
import { zod4Resolver } from 'mantine-form-zod-resolver';

const eventFormSchema = z.object({
  title: z
    .string({
      error: 'Название события обязательно',
    })
    .min(1, 'Название события обязательно'),
  description: z
    .string({
      error: 'Описание события обязательно',
    })
    .min(1, 'Описание события обязательно'),
  startTime: z.date({
    error: 'Дата начала события обязательна',
  }),
  endTime: z.date({
    error: 'Дата окончания события обязательна',
  }),
  status: z.enum(EventStatusData.map((status) => status.value)),
});

const useEventForm = () => {
  return useForm({
    initialValues: {
      title: '',
      description: '',
      startTime: new Date(),
      endTime: new Date(),
      status: EventStatus.DRAFT,
    },
    validate: zod4Resolver(eventFormSchema),
  });
};

export { useEventForm };
