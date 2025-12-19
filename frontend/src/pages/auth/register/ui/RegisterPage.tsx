import { Button, Card, Group, PasswordInput, Stack, TextInput, Title } from '@mantine/core';
import { registerFormSchema, useRegisterForm } from '../model';
import { useHead } from '@unhead/react';
import { z } from 'zod';
import { Link } from 'react-router';
import { useRegister } from '@/entities/user';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router';

const RegisterPage = () => {
  useHead({
    title: 'Регистрация',
    meta: [
      {
        name: 'description',
        content: 'Страница регистрации',
      },
    ],
  });
  const form = useRegisterForm();
  const { mutateAsync: register, isPending } = useRegister();
  const navigate = useNavigate();

  const handleSubmit = async (values: z.infer<typeof registerFormSchema>) => {
    try {
      await register(values);
      notifications.show({
        title: 'Успешно',
        message: 'Вы успешно зарегистрированы',
        color: 'green',
      });
      navigate('/login');
    } catch (error) {
      console.error(error);
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось зарегистрироваться',
        color: 'red',
      });
    }
  };
  return (
    <Card withBorder shadow="sm" radius="md" miw="50%" mih="70%" p="xl">
      <Card.Section withBorder inheritPadding py="xs">
        <Stack>
          <Title order={2} ta="center" fw={700} size="xl">
            Зарегистрироваться
          </Title>
          <form onSubmit={form.onSubmit(handleSubmit)} className="flex flex-col gap-4">
            <TextInput {...form.getInputProps('email')} label="Email" placeholder="email" />
            <TextInput
              {...form.getInputProps('username')}
              label="Придумайте крутое имя"
              placeholder="ваш никнейм"
            />
            <PasswordInput
              {...form.getInputProps('password')}
              label="Пароль"
              placeholder="пароль"
            />
            <Button loading={isPending} type="submit">
              Зарегистрироваться
            </Button>
          </form>
          <Group justify="center">
            <Link to="/login">Уже зарегистрированы? Войдите</Link>
          </Group>
        </Stack>
      </Card.Section>
    </Card>
  );
};

RegisterPage.displayName = 'RegisterPage';

export { RegisterPage };
