import { EventStatusData } from '@/entities/event';
import { Button, Select, Stack, Textarea, TextInput } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useEventForm } from '../model/useEventForm';

const EventForm = () => {
  const form = useEventForm();
  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <Stack gap="md">
        <TextInput label="Название" {...form.getInputProps('title')} />
        <Textarea label="Описание" {...form.getInputProps('description')} />
        <DateTimePicker
          label="Дата начала"
          value={form.values.startTime}
          onChange={(value) => form.setFieldValue('startTime', new Date(value ?? ''))}
          error={form.errors.startTime}
          valueFormat="DD MMMM YYYY HH:mm"
        />

        <DateTimePicker
          label="Дата окончания"
          value={form.values.endTime}
          onChange={(value) => form.setFieldValue('endTime', new Date(value ?? ''))}
          error={form.errors.endTime}
          valueFormat="DD MMMM YYYY HH:mm"
        />

        <Select
          label="Статус"
          {...form.getInputProps('status')}
          data={EventStatusData.map((status) => ({ label: status.label, value: status.value }))}
        />
        <Button type="submit">Добавить</Button>
      </Stack>
    </form>
  );
};

export { EventForm };
