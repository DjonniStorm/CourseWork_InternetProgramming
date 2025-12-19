import { Avatar as MantineAvatar, UnstyledButton } from '@mantine/core';
import { nameToColor } from '@/shared/utils';
import { Link } from 'react-router';

const Avatar = ({ name }: { name: string }) => {
  return (
    <Link to="/profile">
      <UnstyledButton>
        <MantineAvatar name={name} color={nameToColor(name)} />
      </UnstyledButton>
    </Link>
  );
};

export { Avatar };
