import {useForm} from "vee-validate";
import {toTypedSchema} from "@vee-validate/zod";
import {registerFormSchema} from "@/schemas/registerFormSchema.ts";
import {useRegisterMutation} from "@/composables/useRegisterMutation.ts";
import type {RegisterRequest} from "@/types/auth.ts";
import router from "@/router";
import type {AxiosError} from "axios";

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
      onSuccess: () => {
        router.push("/");
      },
      onError: (e) => {
        const err = e as AxiosError<{ message?: string; errors?: Record<string, string[]> }>
        setFieldError("passwordConfirm", err.response?.data?.message ?? "Что-то прошло не так")
      }
    })
  })

  return {
    onSubmit,
    isPending,
  }
}