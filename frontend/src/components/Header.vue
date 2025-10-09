<template>
  <header class="header">
    <div class="header__content">
      <RouterLink to="/" class="header__brand" activeClass="header__brand_active">Social vue</RouterLink>

      <nav class="header__nav">
        <RouterLink to="/users" class="header__link" activeClass="header__link_active">Пользователи</RouterLink>
      </nav>

      <div class="header__auth">
        <span v-if="isLoading" class="header__state">…</span>

        <template v-else-if="isAuthed">
            <div class="header__profile-info">
              <span class="header__profile-name">{{ displayName }}</span>
              <span class="header__profile-username">@{{ user?.username }}</span>
            </div>

          <button
            type="button"
            class="header__button"
            :disabled="logoutPending"
            @click="() => logout()"
          >
            {{ logoutPending ? 'Выходим…' : 'Выйти' }}
          </button>
        </template>

        <template v-else>
          <RouterLink to="/login" class="header__link" activeClass="header__link_active">Войти</RouterLink>
          <RouterLink to="/register" class="header__link" activeClass="header__link_active">Регистрация</RouterLink>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMe } from '@/composables/useMe.ts'
import { useLogout } from '@/composables/useLogout.ts'

const { user, isLoading } = useMe()

const isAuthed = computed(() => !!user.value?.username)
const displayName = computed(() => user.value?.displayName || 'аноним')

const { logout, isPending: logoutPending } = useLogout()
</script>

<style scoped>
.header {
  width: 100%;
  border-bottom: 1px solid black;
  background: #f6f6f6;
}

.header__content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 72px;
  display: flex;
  align-items: center;
  gap: 24px;
}

.header__brand {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-decoration: none;
  color: inherit;
  text-transform: uppercase;
}

.header__brand_active {
  text-decoration: underline;
}

.header__nav {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;
}

.header__auth {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header__link {
  text-decoration: none;
  color: #222;
  font-size: 16px;
}

.header__link:hover {
  text-decoration: underline;
}

.header__link_active {
  text-decoration: underline;
}

.header__state {
  font-size: 16px;
  color: #666;
}

.header__profile-info {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.header__profile-name {
  font-size: 16px;
  font-weight: 600;
}

.header__profile-username {
  font-size: 12px;
  color: #666;
}

.header__button {
  padding: 10px 18px;
  min-width: 140px;
  background: transparent;
  border: 1px solid black;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.header__button:hover {
  cursor: pointer;
  opacity: 0.8;
}

.header__button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 720px) {
  .header__content {
    height: auto;
    padding: 12px 16px;
    flex-wrap: wrap;
    gap: 16px;
  }

  .header__nav {
    order: 3;
    width: 100%;
    justify-content: flex-start;
    margin-left: 0;
  }

  .header__auth {
    width: 100%;
    justify-content: space-between;
  }

  .header__button {
    flex: 1;
  }
}
</style>
