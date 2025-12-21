import { Header } from '@/shared/ui/header';
import { AppShell, Stack, UnstyledButton, Group, Box, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet, Link } from 'react-router';
import { useTokenRefresh } from '@/shared/lib/use-token-refresh';
import { useMe } from '@/entities/user';
import { Avatar } from '@/shared/ui/avatar';

const AppLayout = () => {
  const [opened, { toggle }] = useDisclosure();
  useTokenRefresh();
  const { data: user } = useMe();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }}
      padding="md"
    >
      <Header.App opened={opened} toggle={toggle} name={user?.username || ''} />

      <AppShell.Navbar py="md" px="md">
        <Stack gap="md">
          <Link to="/events">
            <UnstyledButton w="100%" style={{ textAlign: 'left' }}>
              События
            </UnstyledButton>
          </Link>
          <Link to="/invitations">
            <UnstyledButton w="100%" style={{ textAlign: 'left' }}>
              Приглашения
            </UnstyledButton>
          </Link>
          <Link to="/contacts">
            <UnstyledButton w="100%" style={{ textAlign: 'left' }}>
              Контакты
            </UnstyledButton>
          </Link>
          <Link to="/profile">
            <Group gap="xs" mt="md" pt="md" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
              <Tooltip label="Профиль">
                <Box>
                  <Avatar name={user?.username || ''} />
                </Box>
              </Tooltip>
              <UnstyledButton style={{ textAlign: 'left' }}>
                Профиль
              </UnstyledButton>
            </Group>
          </Link>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

AppLayout.displayName = 'AppLayout';

export { AppLayout };
