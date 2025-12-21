import {
  ContactRequestStatus,
  useUserContacts,
  useUpdateContact,
  type ContactRequestResponse,
  useDeleteContact,
} from '@/entities/contact';
import { useMe, useUser } from '@/entities/user';
import { nameToColor } from '@/shared/utils';
import { ContactForm } from '@/features/contact-form';
import {
  Button,
  Card,
  Group,
  Stack,
  Title,
  Text,
  Skeleton,
  SimpleGrid,
  Pill,
  Avatar as MantineAvatar,
  Tabs,
  Tooltip,
  ActionIcon,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useHead } from '@unhead/react';
import { useMemo } from 'react';
import { IconX } from '@tabler/icons-react';

const ContactsPage = () => {
  useHead({
    title: 'Контакты',
    meta: [
      {
        name: 'description',
        content: 'Страница контактов',
      },
    ],
  });

  const { data: user } = useMe();
  const { data: contacts, isLoading } = useUserContacts(user?.id ?? '');
  const { mutateAsync: updateContact } = useUpdateContact();

  const { acceptedContacts, incomingRequests, outgoingRequests } = useMemo(() => {
    if (!contacts || !user) {
      return { acceptedContacts: [], incomingRequests: [], outgoingRequests: [] };
    }

    const accepted = contacts
      .filter((contact) => contact.status === ContactRequestStatus.ACCEPTED)
      .map((contact) => {
        const contactUserId =
          contact.fromUserId === user.id ? contact.toUserId : contact.fromUserId;
        return { ...contact, contactUserId };
      });

    const incoming = contacts.filter(
      (contact) => contact.toUserId === user.id && contact.status === ContactRequestStatus.PENDING,
    );

    const outgoing = contacts.filter(
      (contact) =>
        contact.fromUserId === user.id && contact.status === ContactRequestStatus.PENDING,
    );

    return { acceptedContacts: accepted, incomingRequests: incoming, outgoingRequests: outgoing };
  }, [contacts, user]);

  const handleCreateContact = () => {
    modals.open({
      title: 'Добавить контакт',
      children: (
        <ContactForm
          onSubmit={() => {
            modals.closeAll();
          }}
        />
      ),
    });
  };

  const handleAcceptRequest = async (contact: ContactRequestResponse) => {
    try {
      await updateContact({
        id: contact.id,
        contact: {
          createdAt: contact.createdAt,
          respondedAt: new Date(),
          fromUserId: contact.fromUserId,
          toUserId: contact.toUserId,
          status: ContactRequestStatus.ACCEPTED,
        },
      });
      notifications.show({
        title: 'Запрос принят',
        message: 'Контакт успешно добавлен',
        color: 'green',
      });
    } catch (error) {
      console.error(error);
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось принять запрос',
        color: 'red',
      });
    }
  };

  const handleRejectRequest = async (contact: ContactRequestResponse) => {
    try {
      await updateContact({
        id: contact.id,
        contact: {
          createdAt: contact.createdAt,
          respondedAt: new Date(),
          fromUserId: contact.fromUserId,
          toUserId: contact.toUserId,
          status: ContactRequestStatus.REJECTED,
        },
      });
      notifications.show({
        title: 'Запрос отклонен',
        message: 'Запрос на добавление в контакты отклонен',
        color: 'blue',
      });
    } catch (error) {
      console.error(error);
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось отклонить запрос',
        color: 'red',
      });
    }
  };

  return (
    <Stack gap="xl">
      <Group justify="space-between">
        <Title order={1}>Контакты</Title>
        <Button onClick={handleCreateContact}>Добавить контакт</Button>
      </Group>

      {isLoading && (
        <Stack gap="md">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} height={150} />
          ))}
        </Stack>
      )}

      {!isLoading && (
        <Tabs defaultValue="accepted">
          <Tabs.List>
            <Tabs.Tab value="accepted">Мои контакты ({acceptedContacts.length})</Tabs.Tab>
            <Tabs.Tab value="incoming">Входящие запросы ({incomingRequests.length})</Tabs.Tab>
            <Tabs.Tab value="outgoing">Исходящие запросы ({outgoingRequests.length})</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="accepted" pt="xs">
            {acceptedContacts.length === 0 ? (
              <Text c="dimmed">Нет контактов</Text>
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                {acceptedContacts.map((contact) => (
                  <ContactCard key={contact.id} contactUserId={contact.contactUserId} />
                ))}
              </SimpleGrid>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="incoming" pt="xs">
            {incomingRequests.length === 0 ? (
              <Text c="dimmed">Нет входящих запросов</Text>
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                {incomingRequests.map((contact) => (
                  <IncomingRequestCard
                    key={contact.id}
                    contact={contact}
                    onAccept={() => handleAcceptRequest(contact)}
                    onReject={() => handleRejectRequest(contact)}
                  />
                ))}
              </SimpleGrid>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="outgoing" pt="xs">
            {outgoingRequests.length === 0 ? (
              <Text c="dimmed">Нет исходящих запросов</Text>
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                {outgoingRequests.map((contact) => (
                  <OutgoingRequestCard key={contact.id} contact={contact} />
                ))}
              </SimpleGrid>
            )}
          </Tabs.Panel>
        </Tabs>
      )}
    </Stack>
  );
};

type ContactCardProps = {
  contactUserId: string;
};

const ContactCard = ({ contactUserId }: ContactCardProps) => {
  const { data: contactUser } = useUser(contactUserId);
  const { mutateAsync: deleteContactMutation } = useDeleteContact();
  const contactName = contactUser?.username || contactUserId.slice(0, 8);

  const handleDeleteContact = async (contactId: string) => {
    modals.openConfirmModal({
      title: `Удалить контакт ${contactName}?`,
      children: <Text size="sm">Вы уверены, что хотите удалить контакт {contactName}?</Text>,
      labels: { confirm: 'Удалить', cancel: 'Отмена' },
      onCancel: () => console.log('Отмена'),
      onConfirm: async () => {
        try {
          await deleteContactMutation(contactId);
          notifications.show({
            title: 'Контакт удален',
            message: 'Контакт успешно удален',
            color: 'green',
            icon: <IconX size={16} />,
          });
        } catch (error) {
          console.error(error);
          notifications.show({
            title: 'Ошибка',
            message: 'Не удалось удалить контакт',
            color: 'red',
            icon: <IconX size={16} />,
          });
        }
      },
    });
  };

  return (
    <Card withBorder shadow="sm" padding="lg" radius="md">
      <Group>
        <MantineAvatar name={contactName} color={nameToColor(contactName)} size="lg" />
        <Stack gap="xs" style={{ flex: 1 }}>
          <Text fw={600} size="lg">
            {contactUser?.username || 'Неизвестный пользователь'}
          </Text>
          <Text size="sm" c="dimmed">
            {contactUser?.email || 'Email не указан'}
          </Text>
        </Stack>
        <Tooltip label="Удалить контакт">
          <ActionIcon onClick={() => handleDeleteContact(contactUserId)}>
            <IconX size={16} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Card>
  );
};

type IncomingRequestCardProps = {
  contact: ContactRequestResponse;
  onAccept: () => void;
  onReject: () => void;
};

const IncomingRequestCard = ({ contact, onAccept, onReject }: IncomingRequestCardProps) => {
  const { data: contactUser } = useUser(contact.fromUserId);
  const contactName = contactUser?.username || contact.fromUserId.slice(0, 8);

  return (
    <Card withBorder shadow="sm" padding="lg" radius="md">
      <Stack gap="sm">
        <Group>
          <MantineAvatar name={contactName} color={nameToColor(contactName)} size="lg" />
          <Stack gap="xs" style={{ flex: 1 }}>
            <Text fw={600} size="lg">
              {contactUser?.username || 'Неизвестный пользователь'}
            </Text>
            <Text size="sm" c="dimmed">
              {contactUser?.email || 'Email не указан'}
            </Text>
            <Text size="xs" c="dimmed">
              Отправлен: {new Date(contact.createdAt).toLocaleString('ru-RU')}
            </Text>
          </Stack>
        </Group>
        <Group>
          <Button color="green" onClick={onAccept} size="sm">
            Принять
          </Button>
          <Button color="red" variant="outline" onClick={onReject} size="sm">
            Отклонить
          </Button>
        </Group>
      </Stack>
    </Card>
  );
};

type OutgoingRequestCardProps = {
  contact: ContactRequestResponse;
};

const OutgoingRequestCard = ({ contact }: OutgoingRequestCardProps) => {
  const { data: contactUser } = useUser(contact.toUserId);
  const contactName = contactUser?.username || contact.toUserId.slice(0, 8);

  return (
    <Card withBorder shadow="sm" padding="lg" radius="md">
      <Group align="flex-start">
        <MantineAvatar name={contactName} color={nameToColor(contactName)} size="lg" />
        <Stack gap="xs" style={{ flex: 1 }}>
          <Text fw={600} size="lg">
            {contactUser?.username || 'Неизвестный пользователь'}
          </Text>
          <Text size="sm" c="dimmed">
            {contactUser?.email || 'Email не указан'}
          </Text>
          <Text size="xs" c="dimmed">
            Отправлен: {new Date(contact.createdAt).toLocaleString('ru-RU')}
          </Text>
          <Pill color="yellow" variant="light" maw="fit-content">
            Ожидает ответа
          </Pill>
        </Stack>
        <Tooltip label="Отменить запрос">
          <ActionIcon>
            <IconX size={16} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Card>
  );
};

ContactsPage.displayName = 'ContactsPage';

export { ContactsPage };
