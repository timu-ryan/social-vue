<template>
  <section class="auth-page">
    <div class="auth-card">
      <div class="auth-card__heading">
        <h1 class="auth-card__title">Войдите в аккаунт</h1>
      </div>

      <LoginForm />

      <p class="auth-card__hint">
        Ещё нет аккаунта?
        <RouterLink to="/register" class="auth-card__link">зарегистрируйтесь</RouterLink>
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import LoginForm from '@/components/LoginForm.vue'
</script>

<style scoped>
.auth-page {
  width: 100%;
  padding: 80px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--color-text-primary);
}

.auth-card {
  width: 100%;
  max-width: 520px;
  padding: 36px 40px;
  color: var(--color-text-primary);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.auth-card__heading {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.auth-card__title {
  font-size: 30px;
  font-weight: 600;
}

.auth-card__hint {
  font-size: 14px;
  color: var(--color-text-muted);
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.auth-card__link {
  color: var(--color-link);
  text-decoration: underline;
}

.auth-card__link:hover {
  opacity: 0.8;
}

@media (max-width: 640px) {
  .auth-page {
    padding: 60px 16px;
  }

  .auth-card {
    padding: 28px 24px;
  }

  .auth-card__title {
    font-size: 26px;
  }
}
</style>
