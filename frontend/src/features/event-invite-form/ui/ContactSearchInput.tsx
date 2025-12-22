import { TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

type ContactSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const ContactSearchInput = ({
  value,
  onChange,
  placeholder = 'Поиск контакта...',
}: ContactSearchInputProps) => {
  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      leftSection={<IconSearch size={16} />}
    />
  );
};

export { ContactSearchInput };

