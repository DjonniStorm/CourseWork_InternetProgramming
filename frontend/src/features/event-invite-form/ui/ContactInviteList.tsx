import { Stack, Text, ScrollArea } from '@mantine/core';
import { ContactInviteItem } from './ContactInviteItem';

type ContactInviteListProps = {
  contacts: Array<{ id: string; contactUserId: string }>;
  onInvite: (userId: string) => void;
  searchQuery: string;
};

const ContactInviteList = ({ contacts, onInvite, searchQuery }: ContactInviteListProps) => {
  if (contacts.length === 0) {
    return (
      <Text c="dimmed" size="sm" ta="center" py="md">
        Нет доступных контактов для приглашения
      </Text>
    );
  }

  return (
    <ScrollArea h={400}>
      <Stack gap="xs">
        {contacts.map((contact) => (
          <ContactInviteItem
            key={contact.id}
            contactUserId={contact.contactUserId}
            onInvite={() => onInvite(contact.contactUserId)}
            searchQuery={searchQuery}
          />
        ))}
      </Stack>
    </ScrollArea>
  );
};

export { ContactInviteList };


