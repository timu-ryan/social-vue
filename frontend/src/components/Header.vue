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

        <button
          type="button"
          class="header__theme"
          @click="toggleTheme"
        >
          {{ themeToggleLabel }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMe } from '@/composables/useMe.ts'
import { useLogout } from '@/composables/useLogout.ts'
import { useThemeStore } from '@/stores/theme.ts'

const { user, isLoading } = useMe()

const isAuthed = computed(() => !!user.value?.username)
const displayName = computed(() => user.value?.displayName || 'аноним')

const { logout, isPending: logoutPending } = useLogout()

const themeStore = useThemeStore()
const themeToggleLabel = computed(() =>
  themeStore.theme === 'light' ? 'темная тема' : 'светлая тема'
)
const toggleTheme = () => themeStore.toggle()
</script>

<style scoped>
.header {
  width: 100%;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-muted);
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
  color: var(--color-text-primary);
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
  color: var(--color-text-primary);
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
  color: var(--color-text-muted);
}

.header__profile-info {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.header__profile-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.header__profile-username {
  font-size: 12px;
  color: var(--color-text-muted);
}

.header__button {
  padding: 10px 18px;
  min-width: 140px;
  background: transparent;
  border: 1px solid var(--color-border);
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

.header__theme {
  padding: 8px 14px;
  border: 1px solid var(--color-border);
  background: transparent;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.header__theme:hover {
  cursor: pointer;
  opacity: 0.8;
}

.header__theme:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.12);
}

[data-theme='dark'] .header__theme:focus {
  box-shadow: 0 0 0 2px rgba(148, 163, 184, 0.3);
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
    flex-wrap: wrap;
  }

  .header__button {
    flex: 1;
  }

  .header__theme {
    flex: 1;
  }
}
</style>
