import { AppShell, Box, Burger, Group, Image, Tooltip } from '@mantine/core';
import { Link } from 'react-router';
import { Avatar } from '@shared/ui/avatar';
import { Links } from '@shared/ui/links';

const Logo = () => {
  return (
    <Link to="/">
      <Image
        src="/logo.png"
        alt="Logo"
        width={32}
        height={32}
        style={{
          objectRepeat: 'no-repeat',
        }}
        fit="contain"
        maw="50px"
      />
    </Link>
  );
};

const DefaultHeader = () => {
  return (
    <header className="flex items-center justify-between border-b border-gray-700 rounded-md">
      <Group px="md" py="5px">
        <Logo />
      </Group>
    </header>
  );
};

DefaultHeader.displayName = 'DefaultHeader';

type AppHeaderProps = {
  opened: boolean;
  toggle: () => void;
  name: string;
};

const AppHeader = ({ opened, toggle, name }: AppHeaderProps) => {
  return (
    <AppShell.Header>
      <Group h="100%" px="md" justify="space-between">
        <Group>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Logo />
        </Group>
        <Group visibleFrom="sm" gap="md">
          <Links dir="row" gap={10} />
          <Tooltip label="Профиль">
            <Box>
              <Avatar name={name} />
            </Box>
          </Tooltip>
        </Group>
      </Group>
    </AppShell.Header>
  );
};

const Header = {
  Default: DefaultHeader,
  App: AppHeader,
};

AppHeader.displayName = 'AppHeader';

export { Header };
