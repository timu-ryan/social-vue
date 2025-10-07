<template>
  <header class="header">
    <div class="header__content">
      <div class="header__logo">
        <RouterLink to="/" class="header__link">Social vue</RouterLink>
      </div>

      <nav class="header__nav">
        <!-- пока узнаём пользователя -->
        <span v-if="isFetching" class="header__link">…</span>

        <!-- залогинен -->
        <template v-else-if="isLoggedIn">
          <span class="header__link">Привет, {{ user?.username }}</span>
          <button
              type="button"
              class="header__link"
              :disabled="logoutDisabled"
              @click="onLogout"
          >
            {{ logoutDisabled ? 'Выходим…' : 'Выйти' }}
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
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMutation } from '@tanstack/vue-query'

import { useAuthStore } from '@/stores/auth'
import { useUserQuery } from '@/composables/useUser' // из ответа выше

const router = useRouter()
const auth = useAuthStore()

// читаем пользователя из TanStack-кэша/запроса
const { data: user, isFetching } = useUserQuery()

// считаем признак входа (если есть токен ИЛИ есть user в кэше)
const isLoggedIn = computed(() => !!auth.accessToken || !!user.value)

// mutation для выхода
const logoutMutation = useMutation({
  mutationFn: () => auth.logout(), // важно: () => auth.logout(), а не прямую ссылку
  onSuccess: () => {
    router.push('/login')
  },
})

const onLogout = () => logoutMutation.mutate()

// чтобы не ловить типовые проблемы с Booleanish, даём явный computed
const logoutDisabled = computed(() => logoutMutation.isPending.value)
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

  .header__nav {
    display: flex;
    gap: 16px;
  }
</style>