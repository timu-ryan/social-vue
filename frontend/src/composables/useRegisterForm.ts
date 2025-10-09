import {useForm} from "vee-validate";
import {toTypedSchema} from "@vee-validate/zod";
import {registerFormSchema} from "@/schemas/registerFormSchema.ts";
import {useRegisterMutation} from "@/composables/useRegisterMutation.ts";
import type {RegisterRequest} from "@/types/auth.ts";
import router from "@/router";
import type {AxiosError} from "axios";
import {queryClient} from "@/lib/query.ts";

export function useRegisterForm() {
  const { handleSubmit, setFieldError } = useForm({
    validationSchema: toTypedSchema(registerFormSchema),
  })

  const {
    mutate: register,
    isPending,
  } = useRegisterMutation()

  const onSubmit = handleSubmit(async (values: RegisterRequest) => {
    register(values, {
      onSuccess: (user) => {
        queryClient.refetchQueries({ queryKey: ['user'], type: 'active', exact: true })
        router.push("/");
      },
      onError: (e) => {
        // TODO: вынести сообщения ошибок в константыт
        const err = e as AxiosError<{ message?: string; errors?: Record<string, string[]> }>
        if (err.response?.status === 409) {
          setFieldError("username", "Username или Email уже заняты")
        } else {
          setFieldError("passwordConfirm", err.message ?? "Что-то прошло не так")
        }
      }
    })
  })

  return {
    onSubmit,
    isPending,
  }
}