import { useForm } from '@mantine/form';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';

const profileEditFormSchema = z.object({
  email: z
    .string()
    .refine(
      (val) =>
        val === '' || z.email({ message: 'Введите корректный email' }).safeParse(val).success,
      {
        message: 'Введите корректный email',
      },
    ),
  username: z.string().refine((val) => val === '' || val.length >= 3, {
    message: 'Имя пользователя должно быть не менее 3 символов',
  }),
  password: z.string().refine((val) => val === '' || (val.length >= 8 && val.length <= 52), {
    message: 'Пароль должен быть от 8 до 52 символов',
  }),
});

export type ProfileEditFormValues = z.infer<typeof profileEditFormSchema>;

const createProfileEditFormSchema = (initialEmail: string, initialUsername: string) =>
  z.object({
    email: z
      .string()
      .refine(
        (val) => val === initialEmail || (val !== '' && z.string().email().safeParse(val).success),
        {
          message: 'Введите корректный email',
        },
      ),
    username: z
      .string()
      .refine((val) => val === initialUsername || (val !== '' && val.length >= 3), {
        message: 'Имя пользователя должно быть не менее 3 символов',
      }),
    password: z.string().refine((val) => val === '' || (val.length >= 8 && val.length <= 52), {
      message: 'Пароль должен быть от 8 до 52 символов',
    }),
  });

const useProfileEditForm = (initialData: { email: string; username: string }) => {
  const schema = createProfileEditFormSchema(initialData.email, initialData.username);
  return useForm({
    initialValues: {
      email: initialData.email,
      username: initialData.username,
      password: '',
    },
    validate: zod4Resolver(schema),
  });
};

export { useProfileEditForm, profileEditFormSchema };
