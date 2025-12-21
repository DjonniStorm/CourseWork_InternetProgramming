import { Button, Stack, Title, Text, Card, Group, Center } from '@mantine/core';
import {
  IconAlertCircle,
  IconLock,
  IconFileInfo,
  IconServer,
  IconHome,
  IconArrowLeft,
} from '@tabler/icons-react';
import { useHead } from '@unhead/react';
import { useNavigate, useRouteError, isRouteErrorResponse } from 'react-router';
import type { JSX } from 'react';

type ErrorType = '404' | '403' | '500' | 'unknown';

const getErrorInfo = (
  error: unknown,
): { type: ErrorType; title: string; message: string; icon: JSX.Element } => {
  if (isRouteErrorResponse(error)) {
    const status = error.status;
    if (status === 404) {
      return {
        type: '404',
        title: 'Страница не найдена',
        message:
          'К сожалению, запрашиваемая страница не существует. Возможно, она была удалена или перемещена.',
        icon: <IconFileInfo size={64} stroke={1.5} />,
      };
    }
    if (status === 403) {
      return {
        type: '403',
        title: 'Доступ запрещен',
        message:
          'У вас нет прав для доступа к этому ресурсу. Обратитесь к администратору, если считаете, что это ошибка.',
        icon: <IconLock size={64} stroke={1.5} />,
      };
    }
    if (status >= 500) {
      return {
        type: '500',
        title: 'Ошибка сервера',
        message:
          'Произошла внутренняя ошибка сервера. Мы уже работаем над решением проблемы. Попробуйте позже.',
        icon: <IconServer size={64} stroke={1.5} />,
      };
    }
  }

  if (error instanceof Error) {
    if (error.message.includes('404') || error.message.includes('not found')) {
      return {
        type: '404',
        title: 'Страница не найдена',
        message: 'К сожалению, запрашиваемая страница не существует.',
        icon: <IconFileInfo size={64} stroke={1.5} />,
      };
    }
    if (error.message.includes('403') || error.message.includes('forbidden')) {
      return {
        type: '403',
        title: 'Доступ запрещен',
        message: 'У вас нет прав для доступа к этому ресурсу.',
        icon: <IconLock size={64} stroke={1.5} />,
      };
    }
  }

  return {
    type: 'unknown',
    title: 'Произошла ошибка',
    message: 'Что-то пошло не так. Попробуйте обновить страницу или вернуться на главную.',
    icon: <IconAlertCircle size={64} stroke={1.5} />,
  };
};

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const errorInfo = getErrorInfo(error);

  useHead({
    title: errorInfo.title || errorInfo.type,
    meta: [
      {
        name: 'description',
        content: errorInfo.message,
      },
    ],
  });

  const getColor = () => {
    switch (errorInfo.type) {
      case '404':
        return 'blue';
      case '403':
        return 'red';
      case '500':
        return 'orange';
      default:
        return 'gray';
    }
  };

  return (
    <Center h="100vh" p="md">
      <Card withBorder shadow="md" padding="xl" radius="md" maw={600} w="100%">
        <Stack gap="xl" align="center">
          <div style={{ color: `var(--mantine-color-${getColor()}-6)` }}>{errorInfo.icon}</div>
          <Stack gap="xs" align="center">
            <Title order={1} ta="center">
              {errorInfo.title}
            </Title>
            <Text c="dimmed" ta="center" size="lg">
              {errorInfo.message}
            </Text>
          </Stack>
          <Group justify="center" mt="md">
            <Button
              leftSection={<IconArrowLeft size={18} />}
              variant="light"
              onClick={() => navigate(-1)}
            >
              Назад
            </Button>
            <Button leftSection={<IconHome size={18} />} onClick={() => navigate('/')}>
              На главную
            </Button>
          </Group>
          {import.meta.env.DEV && error instanceof Error && (
            <Card
              withBorder
              padding="md"
              radius="md"
              w="100%"
              style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}
            >
              <Stack gap="xs">
                <Text size="sm" fw={600}>
                  Детали ошибки (только в режиме разработки):
                </Text>
                <Text
                  size="xs"
                  c="dimmed"
                  style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}
                >
                  {error.message}
                  {error.stack && (
                    <pre
                      style={{
                        marginTop: 8,
                        fontSize: '10px',
                        overflow: 'auto',
                        maxHeight: '200px',
                      }}
                    >
                      {error.stack}
                    </pre>
                  )}
                </Text>
              </Stack>
            </Card>
          )}
        </Stack>
      </Card>
    </Center>
  );
};

ErrorPage.displayName = 'ErrorPage';

export { ErrorPage };
