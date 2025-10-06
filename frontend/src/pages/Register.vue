<template>
  <div class="auth">
    <h1>Регистрация</h1>

    <Form :validation-schema="schema" @submit="onSubmit" v-slot="{ isSubmitting }">
      <div class="field">
        <label>Email</label>
        <Field name="email" type="email" placeholder="name@example.com" />
        <ErrorMessage name="email" class="err" />
      </div>

      <div class="field">
        <label>Username</label>
        <Field name="username" type="text" placeholder="alice_123" />
        <ErrorMessage name="username" class="err" />
      </div>

      <div class="field">
        <label>Пароль</label>
        <Field name="password" type="password" placeholder="минимум 8 символов" />
        <ErrorMessage name="password" class="err" />
      </div>

      <div class="field">
        <label>Повтор пароля</label>
        <Field name="confirm" type="password" placeholder="ещё раз пароль" />
        <ErrorMessage name="confirm" class="err" />
      </div>

      <p v-if="serverError" class="err">{{ serverError }}</p>

      <button type="submit" :disabled="isSubmitting">Создать аккаунт</button>
      <RouterLink to="/login" class="link">уже есть аккаунт</RouterLink>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useAuthStore } from '@/stores/auth'

const usernameRegex = /^[\p{L}\p{N}_.-]+$/u

const schema = toTypedSchema(
    z.object({
      email: z.string().email('Некорректный email'),
      username: z.string().min(3, 'Минимум 3').max(32, 'Максимум 32').regex(usernameRegex, 'Разрешены буквы, цифры, .-_'),
      password: z.string().min(8, 'Минимум 8'),
      confirm: z.string().min(8, 'Минимум 8'),
    }).refine((d) => d.password === d.confirm, {
      path: ['confirm'],
      message: 'Пароли не совпадают',
    })
)


const auth = useAuthStore()
const router = useRouter()
const serverError = ref<string | null>(null)

type RegValues = { email: string; username: string; password: string; confirm: string }

async function onSubmit({ email, username, password }: RegValues) {
  serverError.value = null
  try {
    await auth.register({ email, username, password })
    router.push('/')
  } catch (e: any) {
    const payload = e?.response?.data
    if (payload?.error === 'Duplicate value') {
      serverError.value = 'Email или username уже заняты'
    } else {
      serverError.value = payload?.error || 'Не удалось зарегистрироваться'
    }
  }
}
</script>

<style scoped>
.auth { max-width: 420px; margin: 40px auto; display: grid; gap: 14px; }
.field { display: grid; gap: 6px; }
.err { color: #d33; font-size: 0.9rem; }
button { padding: 10px 14px; border: 0; border-radius: 8px; cursor: pointer; }
button[disabled] { opacity: .6; cursor: default; }
.link { margin-left: 12px; font-size: .95rem; }
</style>