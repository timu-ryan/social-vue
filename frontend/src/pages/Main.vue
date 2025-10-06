<template>
  <div class="container">
    <header>
      <h1>Главная</h1>
      <div v-if="auth.isAuthenticated">
        <span>Привет, {{ auth.user?.username }}</span>
        <button @click="logout">Выйти</button>
      </div>
      <div v-else>
        <RouterLink to="/login">Войти</RouterLink>
        <span> · </span>
        <RouterLink to="/register">Регистрация</RouterLink>
      </div>
    </header>


    <pre v-if="auth.user">{{ auth.user }}</pre>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { RouterLink } from "vue-router";


const auth = useAuthStore();


function logout() {
  auth.logout();
}
</script>

<style scoped>
.container { max-width: 800px; margin: 24px auto; }
header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
button { padding: 8px 12px; border: 0; border-radius: 8px; cursor: pointer; }
</style>