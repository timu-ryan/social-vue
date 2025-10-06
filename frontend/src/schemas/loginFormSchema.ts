import * as z from "zod";

export const loginFormSchema = z
  .object({
    login: z.string(),

    password: z
      .string("Обязательное поле"),
  })


export type LoginForm = z.infer<typeof loginFormSchema>;
