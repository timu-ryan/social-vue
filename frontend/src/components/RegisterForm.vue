<template>
  <form @submit.prevent="onSubmit" class="form">
    <label for="email" class="form__label">Email</label>
    <InputText name="email" autoFocus placeholder="example@mail.com" />
    <label for="username" class="form__label">Имя пользователя</label>
    <InputText name="username" placeholder="unique_name_123" />
    <label for="password" class="form__label">Пароль</label>
    <InputText name="password" type="password" />
    <label for="passwordConfirm" class="form__label">Подтвердите пароль</label>
    <InputText name="passwordConfirm" type="password" />

    <button class="submit-button" :disabled="isPending">
      {{ isPending ? 'Регистрация…' : 'Зарегистрироваться' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import InputText from '@/components/InputText.vue'
import {useRegisterForm} from "@/composables/useRegisterForm.ts";

const {
  onSubmit,
  isPending,
} = useRegisterForm();

</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form__label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
}

.form :deep(.input-field) {
  height: 48px;
  padding: 0 14px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: transparent;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form :deep(.input-field:focus) {
  outline: none;
  border-color: var(--color-border);
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.08);
  background: transparent;
}

.form :deep(.input-error) {
  font-size: 12px;
  color: var(--color-error);
}

.submit-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 52px;
  margin-top: 12px;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  transition: opacity 0.2s ease;
}

.submit-button:hover {
  cursor: pointer;
  opacity: 0.8;
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
