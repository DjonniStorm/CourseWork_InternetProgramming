import { AppShell, Burger, Group, Image, UnstyledButton } from '@mantine/core';
import { Link } from 'react-router';
import { Avatar } from '../../avatar';
import { Links } from '../../links';

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
      <Group h="100%" px="md">
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Group justify="space-between" style={{ flex: 1 }}>
          <Logo />
          <Links dir="row" gap={10} />
          <Group>
            <Avatar name={name} />
          </Group>
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
