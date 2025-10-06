<template>
  <div class="register-page">
    <h1 class="title">Добро пожаловать!</h1>
    <RegisterForm />
  </div>
</template>

<script setup lang="ts">
import RegisterForm from "@/components/RegisterForm.vue";
</script>

<style scoped>
.register-page {
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