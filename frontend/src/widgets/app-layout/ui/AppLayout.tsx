import { Header } from '@/shared/ui/header';
import { AppShell, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet } from 'react-router';
import { useTokenRefresh } from '@/shared/lib/use-token-refresh';
import { useMe } from '@/entities/user';

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

      <AppShell.Navbar py="md" px={4}>
        <UnstyledButton>Home</UnstyledButton>
        <UnstyledButton>Blog</UnstyledButton>
        <UnstyledButton>Contacts</UnstyledButton>
        <UnstyledButton>Support</UnstyledButton>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

AppLayout.displayName = 'AppLayout';

export { AppLayout };
