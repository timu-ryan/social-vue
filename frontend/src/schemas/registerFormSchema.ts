import * as z from "zod";

export const registerFormSchema = z
  .object({
    email: z
      .email("Введите корректный адрес электронной почты (example@mail.com)"),

    username: z
      .string("Обязательное поле")
      .min(4, "Имя пользователя должно содержать минимум 4 символа")
      .max(20, "Имя пользователя не может быть длиннее 20 символов"),

    password: z
      .string("Обязательное поле")
      .min(8, "Пароль должен содержать минимум 8 символов")
      .max(20, "Пароль не может быть длиннее 20 символов"),

    passwordConfirm: z
      .string("Обязательное поле")
      .min(8, "Подтверждение пароля должно содержать минимум 8 символов")
      .max(20, "Подтверждение пароля не может быть длиннее 20 символов"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Пароли не совпадают",
    path: ["passwordConfirm"],
  });


export type RegisterForm = z.infer<typeof registerFormSchema>;
