import * as z from "zod";

export const loginFormSchema = z.object({
  login: z
    .string("Обязательное поле")
    .min(1, "Обязательное поле"),
  password: z
    .string("Обязательное поле")
    .min(1, "Обязательное поле"),
})


export type LoginForm = z.infer<typeof loginFormSchema>;
