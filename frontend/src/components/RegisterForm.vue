<template>
  <form @submit.prevent="onSubmit" class="form">
    <label for="email">Email:</label>
    <InputText name="email" autoFocus placeholder="example@mail.com" />
    <label for="username">Имя пользователя:</label>
    <InputText name="username" placeholder="unique_name_123"/>
    <label for="password">Пароль:</label>
    <InputText name="password" type="password" />
    <label for="passwordConfirm">Подтвердите пароль:</label>
    <InputText name="passwordConfirm" type="password" />

    <!--  глобальная ошибка формы  -->
    <span
        class="server-error"
    >
      {{ serverErrorMessage || '\u00A0' }}
    </span>

    <button class="submit-button" :disabled="buttonDisabled">
      {{ buttonDisabled ? 'Регистрация…' : 'Зарегистрироваться' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import {useForm} from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useMutation } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'

import { registerFormSchema, type RegisterForm } from "@/schemas/registerFormSchema.ts";
import { registerUser } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'
import { queryClient } from '@/lib/query'

import InputText from '@/components/InputText.vue'
import {computed, ref} from "vue";
import type {AuthResponse, RegisterRequest} from "@/types/auth.ts";

const router = useRouter()
const auth = useAuthStore()

type RegisterFormWithFormError = RegisterForm & { _form?: string }

const serverErrorMessage = ref('')

const { handleSubmit, isSubmitting } = useForm<RegisterFormWithFormError>({
  validationSchema: toTypedSchema(registerFormSchema),
});

const mutation = useMutation<AuthResponse, unknown, RegisterRequest>({
  mutationFn: registerUser, // (payload) => Promise<AuthResponse>
  onSuccess: (data) => {
    auth.accessToken = data.accessToken
    queryClient.setQueryData(['user'], data.user)
  },
})

const onSubmit = handleSubmit(async (values) => {
  try {
    const { email, username, password } = values
    await mutation.mutateAsync({ email, username, password })
    await router.push('/')
  } catch (err: any) {
    const msg = err?.response?.data?.message || 'Ошибка регистрации'
    serverErrorMessage.value = msg
  }
})

const buttonDisabled = computed(
    () => mutation.isPending.value || isSubmitting.value
)
</script>

<style scoped>

.form {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  gap: 6px;
}

.submit-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 300px;
  height: 50px;
  margin: 0 auto;
  background: transparent;
  border: 1px solid black;
}
.submit-button:hover {
  cursor: pointer;
  opacity: 0.8;
}

.server-error {
  min-height: 1.2em;
  margin-left: 6px;
  font-size: 0.9em;
  color: red;
}

</style>