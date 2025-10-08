import {useForm} from "vee-validate";
import {toTypedSchema} from "@vee-validate/zod";
import {loginFormSchema} from "@/schemas/loginFormSchema.ts";
import {useLoginMutation} from "@/composables/useLoginMutation.ts";
import type {LoginRequest} from "@/types/auth.ts";
import router from "@/router";

import type {AxiosError} from "axios";
import {queryClient} from "@/lib/query.ts";
import {useRoute} from "vue-router";

export function useLoginForm() {

  const route = useRoute();

  const { handleSubmit, setFieldError } = useForm({
    validationSchema: toTypedSchema(loginFormSchema),
  })

  const {
    mutate: login,
    isPending,
  } = useLoginMutation()

  const onSubmit = handleSubmit(async (values: LoginRequest) => {
    login(values, {
      onSuccess: (user) => {
        // или можно явно
        queryClient.refetchQueries({ queryKey: ['user'], type: 'active', exact: true })
        // await queryClient.invalidateQueries({ queryKey: ['user'], exact: true})
        // router.push("/");
        const raw = route.query.redirect
        const target = Array.isArray(raw) ? raw[0] : raw
        const safeTarget = (typeof target === 'string' && target.startsWith('/')) ? target : '/'
        router.replace(safeTarget)
      },
      onError: (e) => {
        const err = e as AxiosError<{ message?: string; errors?: Record<string, string[]> }>
        if (err.response?.status === 401) {
          setFieldError("password", "Неверный логин или пароль")
        } else {
          setFieldError("password", err.message ?? "Что-то прошло не так")
        }
      }
    })
  })

  return {
    onSubmit,
    isPending,
  }
}