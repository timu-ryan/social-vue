<template>
  <header class="header">
    <div class="header__content">
      <nav class="header__nav">
        <RouterLink to="/" class="header__link" activeClass="header__link_active">Social vue</RouterLink>
        <RouterLink to="/users" class="header__link" activeClass="header__link_active">Users</RouterLink>
      </nav>

      <nav class="header__buttons">
        <!-- пока узнаём пользователя -->
        <span v-if="isLoading" class="header__link">…</span>

        <!-- залогинен -->
        <template v-else-if="isAuthed">
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
          <RouterLink to="/login" class="header__link" activeClass="header__link_active">Login</RouterLink>
          <RouterLink to="/register" class="header__link" activeClass="header__link_active">Register</RouterLink>
        </template>

      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">

import { useMe } from "@/composables/useMe.ts";

import {useLogout} from "@/composables/useLogout.ts";
import {computed} from "vue";

const {user, isLoading} = useMe();

const isAuthed = computed(() => !!user.value?.username)

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

  /* в глобальные мб перенести */
  .header__link_active {
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

  .header__buttons {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .header__nav {
    display: flex;
    align-items: center;
    gap: 16px;
  }
</style>