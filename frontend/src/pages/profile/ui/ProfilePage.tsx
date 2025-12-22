import { useMe, useLogout } from '@/entities/user';
import { useInvitations } from '@/entities/invitation';
import { useUserEvents } from '@/entities/event';
import { useUserContacts } from '@/entities/contact';
import { nameToColor, formatDateTime } from '@/shared/utils';
import { ProfileEditForm } from '@/features/profile-edit-form';
import {
  Card,
  Stack,
  Group,
  Title,
  Text,
  Avatar,
  Badge,
  Button,
  Skeleton,
  Divider,
  Paper,
  SimpleGrid,
} from '@mantine/core';
import {
  IconUser,
  IconMail,
  IconCalendar,
  IconShield,
  IconEdit,
  IconUsers,
  IconTicket,
  IconCalendarEvent,
  IconLogout,
} from '@tabler/icons-react';
import { useHead } from '@unhead/react';
import { modals } from '@mantine/modals';
import { useMemo } from 'react';
import { useNavigate, Link } from 'react-router';
import { notifications } from '@mantine/notifications';
import { IconSettings } from '@tabler/icons-react';

const ProfilePage = () => {
  useHead({
    title: 'Профиль',
    meta: [
      {
        name: 'description',
        content: 'Страница профиля пользователя',
      },
    ],
  });

  const { data: user, isLoading } = useMe();
  const { data: invitations } = useInvitations();
  const { data: events } = useUserEvents(user?.id ?? '');
  const { data: contacts } = useUserContacts(user?.id ?? '');
  const { mutateAsync: logout } = useLogout();
  const navigate = useNavigate();

  const stats = useMemo(() => {
    if (!user) {
      return { invitationsCount: 0, eventsCount: 0, contactsCount: 0 };
    }

    const invitationsCount = invitations?.filter((inv) => inv.userId === user.id).length ?? 0;
    const eventsCount = events?.length ?? 0;
    const contactsCount =
      contacts?.filter(
        (contact) =>
          contact.status === 'ACCEPTED' &&
          (contact.fromUserId === user.id || contact.toUserId === user.id),
      ).length ?? 0;

    return { invitationsCount, eventsCount, contactsCount };
  }, [user, invitations, events, contacts]);

  const handleEdit = () => {
    if (!user) {
      return;
    }

    modals.open({
      title: 'Редактировать профиль',
      children: (
        <ProfileEditForm
          initialData={{ email: user.email, username: user.username }}
          userId={user.id}
          onSuccess={() => {
            modals.closeAll();
          }}
        />
      ),
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      notifications.show({
        title: 'Выход выполнен',
        message: 'Вы успешно вышли из аккаунта',
        color: 'blue',
      });
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось выйти из аккаунта',
        color: 'red',
      });
    }
  };

  if (isLoading) {
    return (
      <Stack gap="xl">
        <Title order={1}>Профиль</Title>
        <Card withBorder shadow="sm" padding="xl" radius="md">
          <Stack gap="md">
            <Group>
              <Skeleton height={100} circle />
              <Stack gap="xs" style={{ flex: 1 }}>
                <Skeleton height={28} width="60%" />
                <Skeleton height={20} width="40%" />
              </Stack>
            </Group>
            <Divider />
            <Skeleton height={20} />
            <Skeleton height={20} />
            <Skeleton height={20} />
          </Stack>
        </Card>
      </Stack>
    );
  }

  if (!user) {
    return (
      <Stack gap="xl">
        <Title order={1}>Профиль</Title>
        <Card withBorder shadow="sm" padding="xl" radius="md">
          <Text c="dimmed">Не удалось загрузить данные профиля</Text>
        </Card>
      </Stack>
    );
  }

  return (
    <Stack gap="xl">
      <Group justify="space-between" align="center">
        <Title order={1}>Профиль</Title>
        <Group gap="md">
          {user.role === 'ADMIN' && (
            <Button
              component={Link}
              to="/admin/users"
              leftSection={<IconSettings size={18} />}
              variant="light"
            >
              Управление пользователями
            </Button>
          )}
          <Button leftSection={<IconEdit size={18} />} onClick={handleEdit}>
            Редактировать
          </Button>
          <Button
            leftSection={<IconLogout size={18} />}
            variant="outline"
            color="red"
            onClick={handleLogout}
          >
            Выйти
          </Button>
        </Group>
      </Group>

      <Card withBorder shadow="sm" padding="xl" radius="md">
        <Stack gap="xl">
          <Group gap="xl" align="flex-start">
            <Avatar size={120} radius="md" name={user.username} color={nameToColor(user.username)}>
              {user.username.slice(0, 2).toUpperCase()}
            </Avatar>
            <Stack gap="xs" style={{ flex: 1 }}>
              <Group gap="md" align="center">
                <Title order={2}>{user.username}</Title>
                <Badge color={user.role === 'ADMIN' ? 'red' : 'blue'} variant="light">
                  {user.role === 'ADMIN' ? 'Администратор' : 'Пользователь'}
                </Badge>
              </Group>
              <Text c="dimmed" size="sm">
                ID: {user.id}
              </Text>
            </Stack>
          </Group>

          <Divider />

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
            <Paper p="md" withBorder radius="md">
              <Group gap="md">
                <IconMail size={24} stroke={1.5} style={{ color: 'var(--mantine-color-blue-6)' }} />
                <Stack gap={4}>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                    Email
                  </Text>
                  <Text size="md" fw={500}>
                    {user.email}
                  </Text>
                </Stack>
              </Group>
            </Paper>

            <Paper p="md" withBorder radius="md">
              <Group gap="md">
                <IconUser
                  size={24}
                  stroke={1.5}
                  style={{ color: 'var(--mantine-color-green-6)' }}
                />
                <Stack gap={4}>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                    Имя пользователя
                  </Text>
                  <Text size="md" fw={500}>
                    {user.username}
                  </Text>
                </Stack>
              </Group>
            </Paper>

            <Paper p="md" withBorder radius="md">
              <Group gap="md">
                <IconCalendar
                  size={24}
                  stroke={1.5}
                  style={{ color: 'var(--mantine-color-orange-6)' }}
                />
                <Stack gap={4}>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                    Дата регистрации
                  </Text>
                  <Text size="md" fw={500}>
                    {formatDateTime(user.createdAt)}
                  </Text>
                </Stack>
              </Group>
            </Paper>

            <Paper p="md" withBorder radius="md">
              <Group gap="md">
                <IconShield
                  size={24}
                  stroke={1.5}
                  style={{ color: 'var(--mantine-color-red-6)' }}
                />
                <Stack gap={4}>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                    Роль
                  </Text>
                  <Badge color={user.role === 'ADMIN' ? 'red' : 'blue'} variant="light" size="lg">
                    {user.role === 'ADMIN' ? 'Администратор' : 'Пользователь'}
                  </Badge>
                </Stack>
              </Group>
            </Paper>
          </SimpleGrid>

          <Divider />

          <Title order={3}>Статистика</Title>
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
            <Paper p="md" withBorder radius="md" style={{ textAlign: 'center' }}>
              <Stack gap="xs" align="center">
                <IconTicket
                  size={32}
                  stroke={1.5}
                  style={{ color: 'var(--mantine-color-blue-6)' }}
                />
                <Text size="xl" fw={700}>
                  {stats.invitationsCount}
                </Text>
                <Text size="sm" c="dimmed">
                  Приглашений
                </Text>
              </Stack>
            </Paper>

            <Paper p="md" withBorder radius="md" style={{ textAlign: 'center' }}>
              <Stack gap="xs" align="center">
                <IconCalendarEvent
                  size={32}
                  stroke={1.5}
                  style={{ color: 'var(--mantine-color-green-6)' }}
                />
                <Text size="xl" fw={700}>
                  {stats.eventsCount}
                </Text>
                <Text size="sm" c="dimmed">
                  Событий
                </Text>
              </Stack>
            </Paper>

            <Paper p="md" withBorder radius="md" style={{ textAlign: 'center' }}>
              <Stack gap="xs" align="center">
                <IconUsers
                  size={32}
                  stroke={1.5}
                  style={{ color: 'var(--mantine-color-orange-6)' }}
                />
                <Text size="xl" fw={700}>
                  {stats.contactsCount}
                </Text>
                <Text size="sm" c="dimmed">
                  Контактов
                </Text>
              </Stack>
            </Paper>
          </SimpleGrid>
        </Stack>
      </Card>
    </Stack>
  );
};

ProfilePage.displayName = 'ProfilePage';

export { ProfilePage };
