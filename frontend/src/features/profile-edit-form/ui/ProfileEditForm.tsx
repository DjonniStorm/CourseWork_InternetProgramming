import { useUpdateUser, type UserUpdate } from '@/entities/user';
import { useProfileEditForm } from '../model/useProfileEditForm';
import { Button, Stack, TextInput, Group } from '@mantine/core';
import { IconMail, IconUser } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';

type ProfileEditFormProps = {
  initialData: { email: string; username: string };
  userId: string;
  onSuccess: () => void;
};

const ProfileEditForm = ({ initialData, userId, onSuccess }: ProfileEditFormProps) => {
  const { mutateAsync: updateUser } = useUpdateUser();
  const [isLoading, setIsLoading] = useState(false);
  const form = useProfileEditForm(initialData);

  const handleSubmit = async (values: typeof form.values) => {
    setIsLoading(true);
    try {
      const updateData: UserUpdate = {
        email: values.email === initialData.email ? initialData.email : values.email,
        username: values.username === initialData.username ? initialData.username : values.username,
        password: values.password || '',
      };
      await updateUser({ id: userId, user: updateData });
      notifications.show({
        title: 'Профиль обновлен',
        message: 'Данные профиля успешно обновлены',
        color: 'green',
      });
      onSuccess();
    } catch (error) {
      console.error(error);
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось обновить профиль',
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <TextInput
          label="Email"
          placeholder="Введите email"
          leftSection={<IconMail size={16} />}
          {...form.getInputProps('email')}
        />
        <TextInput
          label="Имя пользователя"
          placeholder="Введите имя пользователя"
          leftSection={<IconUser size={16} />}
          {...form.getInputProps('username')}
        />
        <TextInput
          label="Новый пароль (оставьте пустым, чтобы не менять)"
          placeholder="Введите новый пароль"
          type="password"
          {...form.getInputProps('password')}
        />
        <Group justify="flex-end" mt="md">
          <Button variant="subtle" onClick={() => onSuccess()}>
            Отмена
          </Button>
          <Button type="submit" loading={isLoading}>
            Сохранить
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export { ProfileEditForm };
