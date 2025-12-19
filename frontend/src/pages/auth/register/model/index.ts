import { useForm } from '@mantine/form';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import z from 'zod';

const registerFormSchema = z.object({
  email: z.email({
    message: 'Введите корректный email',
  }),
  username: z.string().min(3, {
    message: 'Имя пользователя должно быть не менее 3 символов',
  }),
  password: z.string().min(8, {
    message: 'Пароль должен быть не менее 8 символов',
  }),
});

const useRegisterForm = () => {
  const form = useForm({
    initialValues: {
      email: '',
      username: '',
      password: '',
    },
    validate: zod4Resolver(registerFormSchema),
  });
  return form;
};

export { useRegisterForm, registerFormSchema };
