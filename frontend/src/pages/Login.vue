<template>
  <div class="login-page">
    <h1 class="title">Войдите в аккаунт</h1>
    <LoginForm />
  </div>
</template>

<script setup lang="ts">

import LoginForm from "@/components/LoginForm.vue";
</script>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 60px 20px;
}

.title {
  margin: 0 0 30px;
}
</style>