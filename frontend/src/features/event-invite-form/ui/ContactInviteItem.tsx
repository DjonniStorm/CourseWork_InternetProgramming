import { useUser } from '@/entities/user';
import { nameToColor } from '@/shared/utils';
import { Group, Stack, Text, Avatar as MantineAvatar, Badge, Skeleton } from '@mantine/core';
import { IconUserCheck } from '@tabler/icons-react';
import { useMemo } from 'react';

type ContactInviteItemProps = {
  contactUserId: string;
  onInvite: () => void;
  searchQuery: string;
};

const ContactInviteItem = ({ contactUserId, onInvite, searchQuery }: ContactInviteItemProps) => {
  const { data: user, isLoading } = useUser(contactUserId);

  const matchesSearch = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return true;
    const query = searchQuery.toLowerCase();
    return (
      user?.username.toLowerCase().includes(query) || user?.email.toLowerCase().includes(query)
    );
  }, [user, searchQuery]);

  if (isLoading) {
    return <Skeleton height={60} />;
  }

  if (!matchesSearch) {
    return null;
  }

  const userName = user?.username || contactUserId.slice(0, 8);

  return (
    <Group
      gap="sm"
      p="sm"
      style={{
        cursor: 'pointer',
        borderRadius: '4px',
        border: '1px solid var(--mantine-color-gray-3)',
      }}
      onClick={onInvite}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--mantine-color-gray-0)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <MantineAvatar name={userName} color={nameToColor(userName)} size="md" />
      <Stack gap={2} style={{ flex: 1 }}>
        <Text fw={500} size="sm">
          {user?.username || 'Неизвестный пользователь'}
        </Text>
        {user?.email && (
          <Text size="xs" c="dimmed">
            {user.email}
          </Text>
        )}
      </Stack>
      <Badge leftSection={<IconUserCheck size={12} />} variant="light" color="blue">
        Контакт
      </Badge>
    </Group>
  );
};

export { ContactInviteItem };


