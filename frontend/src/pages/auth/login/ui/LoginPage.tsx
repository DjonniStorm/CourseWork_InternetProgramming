import { Button, Card, Group, PasswordInput, Stack, TextInput, Title } from '@mantine/core';
import { useHead } from '@unhead/react';
import { loginFormSchema, useLoginForm } from '../model';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router';
import { notifications } from '@mantine/notifications';
import { useLogin } from '@/entities/user';

const LoginPage = () => {
  useHead({
    title: 'Логин',
    meta: [
      {
        name: 'description',
        content: 'Страница входа в систему',
      },
    ],
  });

  const { mutateAsync: login, isPending } = useLogin();
  const navigate = useNavigate();
  const handleSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    try {
      await login(values);
      notifications.show({
        title: 'Успешно',
        message: 'Вы успешно вошли в систему',
        color: 'green',
      });
      navigate('/');
    } catch (error) {
      console.error(error);
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось войти',
        color: 'red',
      });
    }
  };

  const form = useLoginForm();
  return (
    <>
      <Card withBorder shadow="sm" radius="md" miw="50%" mih="70%" p="xl">
        <Card.Section withBorder inheritPadding py="xs">
          <Stack>
            <Title order={2} ta="center" fw={700} size="xl">
              Войдите в систему
            </Title>
            <form onSubmit={form.onSubmit(handleSubmit)} className="flex flex-col gap-4">
              <TextInput {...form.getInputProps('email')} label="Email" placeholder="Email" />
              <PasswordInput
                {...form.getInputProps('password')}
                label="Password"
                placeholder="Password"
              />
              <Button loading={isPending} type="submit">
                Войти
              </Button>
            </form>
            <Group justify="center">
              <Link to="/register">Зарегистрироваться</Link>
            </Group>
          </Stack>
        </Card.Section>
      </Card>
    </>
  );
};

LoginPage.displayName = 'LoginPage';

export { LoginPage };
