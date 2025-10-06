<template>
  <form @submit.prevent="onSubmit" class="form">
    <label for="login">Имя пользователя или email:</label>
    <InputText name="login" autoFocus placeholder="unique_name_123 или example@mail.com" />
    <label for="password">Пароль:</label>
    <InputText name="password" type="password" />

    <button class="submit-button">Войти</button>
  </form>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { loginFormSchema } from "@/schemas/loginFormSchema.ts";

import InputText from '@/components/InputText.vue'

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(loginFormSchema),
});

const onSubmit = handleSubmit(values => {
  console.log(values)
});

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

</style>