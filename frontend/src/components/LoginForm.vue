<template>
  <form @submit.prevent="onSubmit" class="form">
    <label for="login">Имя пользователя или email:</label>
    <InputText name="login" autoFocus placeholder="unique_name_123 или example@mail.com" />
    <label for="password">Пароль:</label>
    <InputText name="password" type="password" />

    <!--  глобальная ошибка формы  -->
    <span
        class="server-error"
    >
      {{ serverErrorMessage || '\u00A0' }}
    </span>

    <button class="submit-button" :disabled="buttonDisabled">
      {{ buttonDisabled ? 'Вход…' : 'Войти' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useMutation } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'

import { loginUser } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'
import { queryClient } from '@/lib/query'

import { loginFormSchema, type LoginForm } from "@/schemas/loginFormSchema.ts";

import InputText from '@/components/InputText.vue'
import {computed, ref} from "vue";


const router = useRouter()
const auth = useAuthStore()

type LoginFormWithFormError = LoginForm & { _form?: string }

const serverErrorMessage = ref('')

const { handleSubmit, isSubmitting } = useForm<LoginFormWithFormError>({
  validationSchema: toTypedSchema(loginFormSchema),
});

const mutation = useMutation({
  mutationFn: loginUser,
  onSuccess: (data) => {
    auth.accessToken = data.accessToken
    // сразу в кэш, чтобы не ждать отдельный /api/me
    queryClient.setQueryData(['user'], data.user)
  },
})

const onSubmit = handleSubmit(async (values) => {
  try {
    await mutation.mutateAsync(values)
    await router.push('/')
  } catch (err: any) {
    const msg = err?.response?.data?.message || 'Ошибка входа'
    serverErrorMessage.value = msg
  }
});

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