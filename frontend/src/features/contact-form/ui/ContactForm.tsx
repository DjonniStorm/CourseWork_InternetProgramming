import { UserSearch } from '@/features/user-search';
import { useCreateContact, ContactRequestStatus } from '@/entities/contact';
import { useMe } from '@/entities/user';
import type { UserResponse } from '@/entities/user';
import { Stack, Button, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';

type ContactFormProps = {
  onSubmit: () => void;
};

const ContactForm = ({ onSubmit }: ContactFormProps) => {
  const { data: currentUser } = useMe();
  const { mutateAsync: createContact } = useCreateContact();
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectUser = (user: UserResponse) => {
    setSelectedUser(user);
  };

  const handleSubmit = async () => {
    if (!selectedUser || !currentUser) {
      notifications.show({
        title: 'Ошибка',
        message: 'Выберите пользователя',
        color: 'red',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createContact({
        createdAt: new Date(),
        respondedAt: null,
        fromUserId: currentUser.id,
        toUserId: selectedUser.id,
        status: ContactRequestStatus.PENDING,
      });
      notifications.show({
        title: 'Запрос отправлен',
        message: `Запрос на добавление в контакты отправлен пользователю ${selectedUser.username}`,
        color: 'green',
      });
      onSubmit();
    } catch (error: unknown) {
      console.error(error);
      let errorMessage = 'Не удалось отправить запрос';
      if (error instanceof Error && 'status' in error) {
        const status = (error as Error & { status: number }).status;
        if (status === 409) {
          errorMessage = 'Запрос на добавление в контакты уже существует';
        } else if (status === 400) {
          errorMessage = 'Некорректные данные запроса';
        }
      }
      notifications.show({
        title: 'Ошибка',
        message: errorMessage,
        color: 'red',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack gap="md">
      <UserSearch
        onSelectUser={handleSelectUser}
        excludeUserIds={currentUser ? [currentUser.id] : []}
      />
      {selectedUser && (
        <Text size="sm" c="dimmed">
          Выбран: {selectedUser.username} ({selectedUser.email})
        </Text>
      )}
      <Button onClick={handleSubmit} disabled={!selectedUser || isSubmitting} loading={isSubmitting}>
        Отправить запрос
      </Button>
    </Stack>
  );
};

export { ContactForm };

