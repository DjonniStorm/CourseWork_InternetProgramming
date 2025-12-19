import { Avatar as MantineAvatar } from '@mantine/core';
import { nameToColor } from '@/shared/utils';

const Avatar = ({ name }: { name: string }) => {
  return <MantineAvatar name={name} color={nameToColor(name)} />;
};

export { Avatar };
