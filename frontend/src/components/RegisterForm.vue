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

    <button class="submit-button">Зарегистрироваться</button>
  </form>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { registerFormSchema } from "@/schemas/registerFormSchema.ts";

import InputText from '@/components/InputText.vue'

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(registerFormSchema),
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