import { Group, UnstyledButton } from '@mantine/core';
import { Link } from 'react-router';

type LinksProps = {
  dir: 'row' | 'col';
  gap: number;
};

const Links = ({ dir, gap }: LinksProps) => {
  return (
    <Group dir={dir} gap={gap}>
      <Link to="/events">
        <UnstyledButton>События</UnstyledButton>
      </Link>
      <Link to="/invitations">
        <UnstyledButton>Приглашения</UnstyledButton>
      </Link>
      <Link to="/contacts">
        <UnstyledButton>Контакты</UnstyledButton>
      </Link>
    </Group>
  );
};

export { Links };
