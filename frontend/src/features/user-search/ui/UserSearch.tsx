import { useSearchUsers, type UserResponse } from '@/entities/user';
import { nameToColor } from '@/shared/utils';
import {
  TextInput,
  ScrollArea,
  Stack,
  Group,
  Text,
  Avatar as MantineAvatar,
  Skeleton,
  Button,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useState, useEffect } from 'react';
import { IconSearch } from '@tabler/icons-react';

type UserSearchProps = {
  onSelectUser: (user: UserResponse) => void;
  excludeUserIds?: string[];
};

const UserSearch = ({ onSelectUser, excludeUserIds = [] }: UserSearchProps) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 300);
  const [page, setPage] = useState(0);
  const [accumulatedUsers, setAccumulatedUsers] = useState<UserResponse[]>([]);
  const size = 20;

  const shouldSearch = debouncedQuery.length >= 2;
  const { data, isLoading, isFetching } = useSearchUsers(debouncedQuery, page, size, shouldSearch);

  // Reset accumulated users when query changes
  // This is a valid use case for syncing state with query results
  useEffect(() => {
    if (debouncedQuery.length >= 2 && page !== 0) {
      setPage(0);
      setAccumulatedUsers([]);
    }
    // eslint-disable-next-line
  }, [debouncedQuery]);

  // Accumulate users from paginated results
  // This is a valid use case for syncing state with query results
  useEffect(() => {
    if (data?.content) {
      if (page === 0) {
        setAccumulatedUsers(data.content);
      } else {
        setAccumulatedUsers((prev) => {
          const newUsers = data.content.filter((user) => !prev.some((u) => u.id === user.id));
          return [...prev, ...newUsers];
        });
      }
    }
    // eslint-disable-next-line
  }, [data?.content, page]);

  const filteredUsers = accumulatedUsers.filter((user) => !excludeUserIds.includes(user.id));

  const handleLoadMore = () => {
    if (data && page < data.totalPages - 1) {
      setPage((prev) => prev + 1);
    }
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
  };

  return (
    <Stack gap="md">
      <TextInput
        placeholder="Введите username или email"
        value={query}
        onChange={(e) => handleQueryChange(e.target.value)}
        leftSection={<IconSearch size={16} />}
      />

      {debouncedQuery.length >= 2 && (
        <ScrollArea h={300}>
          <Stack gap="xs">
            {isLoading && (
              <>
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} height={60} />
                ))}
              </>
            )}

            {!isLoading && filteredUsers.length === 0 && (
              <Text c="dimmed" ta="center" py="md">
                Пользователи не найдены
              </Text>
            )}

            {!isLoading &&
              filteredUsers.map((user) => (
                <Group
                  key={user.id}
                  p="sm"
                  style={{ cursor: 'pointer', borderRadius: '4px' }}
                  onClick={() => onSelectUser(user)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--mantine-color-gray-1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <MantineAvatar name={user.username} color={nameToColor(user.username)} />
                  <Stack gap={0} style={{ flex: 1 }}>
                    <Text fw={500}>{user.username}</Text>
                    <Text size="sm" c="dimmed">
                      {user.email}
                    </Text>
                  </Stack>
                </Group>
              ))}

            {!isLoading && data && page < data.totalPages - 1 && (
              <Button variant="light" onClick={handleLoadMore} loading={isFetching} fullWidth>
                Загрузить еще
              </Button>
            )}
          </Stack>
        </ScrollArea>
      )}

      {debouncedQuery.length < 2 && debouncedQuery.length > 0 && (
        <Text c="dimmed" ta="center" py="md">
          Введите минимум 2 символа для поиска
        </Text>
      )}
    </Stack>
  );
};

export { UserSearch };
