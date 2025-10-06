<template>
  <div class="auth">
    <h1>Вход</h1>

    <!-- values-обработчик + slot для isSubmitting -->
    <Form :validation-schema="schema" @submit="onSubmit" v-slot="{ isSubmitting }">
      <div class="field">
        <label>Логин (email или username)</label>
        <Field name="login" type="text" placeholder="alice или alice@example.com" />
        <ErrorMessage name="login" class="err" />
      </div>

      <div class="field">
        <label>Пароль</label>
        <Field name="password" type="password" placeholder="••••••••" />
        <ErrorMessage name="password" class="err" />
      </div>

      <p v-if="serverError" class="err">{{ serverError }}</p>

      <button type="submit" :disabled="isSubmitting">Войти</button>
      <RouterLink to="/register" class="link">или создать аккаунт</RouterLink>
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

const schema = toTypedSchema(
    z.object({
      login: z.string().min(3, 'Минимум 3 символа'),
      password: z.string().min(8, 'Минимум 8 символов'),
    })
)

const auth = useAuthStore()
const router = useRouter()
const serverError = ref<string | null>(null)

async function onSubmit(values: { login: string; password: string }) {
  serverError.value = null
  try {
    await auth.login(values)
    router.push('/')
  } catch (e: any) {
    serverError.value = e?.response?.data?.error || 'Не удалось войти'
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