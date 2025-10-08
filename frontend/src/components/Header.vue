<template>
  <header class="header">
    <div class="header__content">
      <div class="header__logo">
        <RouterLink to="/" class="header__link">Social vue</RouterLink>
      </div>

      <nav class="header__nav">
        <!-- пока узнаём пользователя -->
        <span v-if="isLoading" class="header__link">…</span>

        <!-- залогинен -->
        <template v-else-if="user?.username">
          <span class="">Привет, {{ user?.username }}</span>
          <button
              type="button"
              class="header__button"
              :disabled="logoutPending"
              @click="() => logout()"
          >
            {{ logoutPending ? 'Выходим…' : 'Выйти' }}
          </button>
        </template>

        <!-- гость -->
        <template v-else>
          <RouterLink to="/login" class="header__link">Login</RouterLink>
          <RouterLink to="/register" class="header__link">Register</RouterLink>
        </template>

      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">

import { useMe } from "@/composables/useMe.ts";

import {useLogout} from "@/composables/useLogout.ts";

const {user, isLoading} = useMe();

const {logout, isPending: logoutPending} = useLogout()

</script>

<style scoped>
  .header {
    width: 100%;
    height: 60px;
    border-bottom: 1px solid grey;
  }

  .header__content {
    width: 100%;
    height: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header__logo {

  }

  .header__link {
    text-decoration: none;
    color: black;
  }

  .header__link:hover {
    text-decoration: underline;
  }

  .header__button {
    padding: 6px;
    min-width: 140px;
    background-color: transparent;
    border: 1px solid black;
  }
  .header__button:hover {
    cursor: pointer;
    opacity: 0.8;
  }

  .header__nav {
    display: flex;
    align-items: center;
    gap: 16px;
  }
</style>