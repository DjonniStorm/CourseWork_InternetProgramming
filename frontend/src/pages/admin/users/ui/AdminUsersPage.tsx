import { useUsers, useUpdateUser, useMe, UserRole } from '@/entities/user';
import { formatDateTime } from '@/shared/utils';
import {
  Stack,
  Group,
  Title,
  Text,
  Skeleton,
  Badge,
  Select,
  SimpleGrid,
  Table,
  Paper,
  Center,
} from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import { useHead } from '@unhead/react';
import { notifications } from '@mantine/notifications';
import { Navigate } from 'react-router';

const SYSTEM_ADMIN_EMAIL = 'admin@system.local';

const AdminUsersPage = () => {
  useHead({
    title: 'Управление пользователями',
    meta: [
      {
        name: 'description',
        content: 'Страница управления пользователями',
      },
    ],
  });

  const { data: currentUser, isLoading: isCurrentUserLoading } = useMe();
  const { data: users, isLoading } = useUsers();
  const { mutateAsync: updateUser } = useUpdateUser();

  // Проверяем, является ли пользователь админом
  if (isCurrentUserLoading) {
    return (
      <Stack gap="xl">
        <Title order={1}>Управление пользователями</Title>
        <Center>
          <Skeleton height={50} width="100%" />
        </Center>
      </Stack>
    );
  }

  if (!currentUser || currentUser.role !== UserRole.ADMIN) {
    return <Navigate to="/profile" replace />;
  }

  const handleRoleChange = async (userId: string, newRole: UserRole, userEmail: string) => {
    // Запрещаем редактировать системного пользователя
    if (userEmail === SYSTEM_ADMIN_EMAIL) {
      notifications.show({
        title: 'Ошибка',
        message: 'Нельзя изменить роль системного пользователя',
        color: 'red',
      });
      return;
    }

    // Запрещаем админу менять свою роль
    if (currentUser?.id === userId) {
      notifications.show({
        title: 'Ошибка',
        message: 'Вы не можете изменить свою роль',
        color: 'red',
      });
      return;
    }

    try {
      await updateUser({
        id: userId,
        user: { role: newRole },
      });
      notifications.show({
        title: 'Роль обновлена',
        message: 'Роль пользователя успешно изменена',
        color: 'green',
      });
    } catch (error) {
      console.error(error);
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось изменить роль пользователя',
        color: 'red',
      });
    }
  };

  if (isLoading) {
    return (
      <Stack gap="xl">
        <Title order={1}>Управление пользователями</Title>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} height={200} />
          ))}
        </SimpleGrid>
      </Stack>
    );
  }

  if (!users || users.length === 0) {
    return (
      <Stack gap="xl">
        <Title order={1}>Управление пользователями</Title>
        <Text c="dimmed">Нет пользователей</Text>
      </Stack>
    );
  }

  return (
    <Stack gap="xl">
      <Title order={1}>Управление пользователями</Title>

      <Paper withBorder shadow="sm" p="md" radius="md">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Пользователь</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Дата регистрации</Table.Th>
              <Table.Th>Текущая роль</Table.Th>
              <Table.Th>Изменить роль</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {users.map((user) => (
              <Table.Tr key={user.id}>
                <Table.Td>
                  <Group gap="xs">
                    <IconUser size={20} />
                    <Text fw={500}>{user.username}</Text>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{user.email}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{formatDateTime(user.createdAt)}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge color={user.role === UserRole.ADMIN ? 'red' : 'blue'} variant="light">
                    {user.role === UserRole.ADMIN ? 'Администратор' : 'Пользователь'}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Select
                    data={[
                      { label: 'Пользователь', value: UserRole.USER },
                      { label: 'Администратор', value: UserRole.ADMIN },
                    ]}
                    value={user.role}
                    onChange={(value) => {
                      if (value) {
                        handleRoleChange(user.id, value as UserRole, user.email);
                      }
                    }}
                    disabled={currentUser?.id === user.id || user.email === SYSTEM_ADMIN_EMAIL}
                    w={200}
                  />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </Stack>
  );
};

AdminUsersPage.displayName = 'AdminUsersPage';

export { AdminUsersPage };
