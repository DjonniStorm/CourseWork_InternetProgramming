import { useForm } from '@mantine/form';
import { z } from 'zod';
import { zod4Resolver } from 'mantine-form-zod-resolver';

const loginFormSchema = z.object({
  email: z.email({
    error: 'Введите корректный email',
  }),
  password: z
    .string({
      error: 'Введите пароль',
    })
    .min(8, {
      message: 'Пароль должен быть не менее 8 символов',
    }),
});

const useLoginForm = () => {
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: zod4Resolver(loginFormSchema),
  });

  return form;
};

export { useLoginForm, loginFormSchema };
