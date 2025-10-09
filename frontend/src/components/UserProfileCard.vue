<template>
  <article class="profile-card">
    <header class="profile-card__header">
      <h1 class="profile-card__title">{{ titleText }}</h1>
      <button
        v-if="canEditProfile"
        type="button"
        class="profile-card__edit-button"
        @click="onEditClick"
      >
        изменить
      </button>
    </header>

    <p v-if="isLoading" class="profile-card__state">загружаю профиль…</p>

    <div v-else-if="hasError" class="profile-card__state profile-card__state_error">
      <span>не удалось загрузить профиль</span>
      <span class="profile-card__error-details">{{ errorMessage }}</span>
    </div>

    <div v-else-if="hasUser" class="profile-card__body">
      <div class="profile-card__summary">
        <img
          :src="avatarSrc"
          alt="аватар"
          class="profile-card__avatar"
          height="160"
          width="160"
        />
        <div class="profile-card__primary-info">
          <p class="profile-card__name">{{ displayName }}</p>
          <p class="profile-card__username">{{ usernameLabel }}</p>
          <p class="profile-card__bio">{{ bioText }}</p>
        </div>
      </div>

      <dl class="profile-card__details">
        <div class="profile-card__details-item">
          <dt>email</dt>
          <dd>{{ emailText }}</dd>
        </div>
        <div class="profile-card__details-item" v-if="createdAtFormatted">
          <dt>создан</dt>
          <dd>
            {{ createdAtFormatted }}
            <span class="profile-card__details-muted">({{ createdAgo }})</span>
          </dd>
        </div>
      </dl>
    </div>

    <div v-else-if="showGuestCta" class="profile-card__state profile-card__state_guest">
      <span>Здесь пока пусто.</span>
      <p class="profile-card__hint">
        <RouterLink to="/login" class="profile-card__link">Войдите</RouterLink>
        или
        <RouterLink to="/register" class="profile-card__link">создайте аккаунт</RouterLink>,
        чтобы заполнить профиль.
      </p>
    </div>

    <p v-else class="profile-card__state">пользователь не найден</p>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatInMoscow, formatRelative } from '@/utils'
import type { AuthUser } from '@/types/user'

const props = defineProps<{
  user: AuthUser | null | undefined
  isLoading?: boolean
  error?: unknown
  canEdit?: boolean
  showGuestCta?: boolean
  title?: string
}>()

const emit = defineEmits<{ (e: 'edit'): void }>()

const hasUser = computed(() => !!props.user)
const titleText = computed(() => props.title ?? 'Профиль')
const canEditProfile = computed(() => !!props.canEdit)
const hasError = computed(() => !!props.error && !props.isLoading)

const avatarSrc = computed(() => props.user?.avatarUrl || '/user-avatar.png')
const displayName = computed(() => props.user?.displayName || 'аноним')
const usernameLabel = computed(() => {
  const username = props.user?.username
  return username ? `@${username}` : 'username не задан'
})
const bioText = computed(() => props.user?.bio || 'описание пока пустует')
const emailText = computed(() => props.user?.email ?? '—')

const createdAtFormatted = computed(() => {
  if (!props.user?.createdAt) return ''
  return formatInMoscow(props.user.createdAt)
})

const createdAgo = computed(() => {
  if (!props.user?.createdAt) return ''
  return formatRelative(props.user.createdAt)
})

const errorMessage = computed(() => {
  const err = props.error
  if (!err) return ''
  if (typeof err === 'string') return err
  if (err instanceof Error) return err.message
  if (typeof err === 'object') {
    try {
      return JSON.stringify(err)
    } catch (e) {
      return 'неизвестная ошибка'
    }
  }
  return String(err)
})

const showGuestCta = computed(() => !!props.showGuestCta && !props.isLoading && !props.error)

const onEditClick = () => {
  if (!canEditProfile.value) return
  emit('edit')
}
</script>

<style scoped>
.profile-card {
  width: 100%;
  max-width: 640px;
  border-bottom: 1px solid black;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: white;
}

.profile-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.profile-card__title {
  font-size: 28px;
  font-weight: 600;
}

.profile-card__edit-button {
  min-width: 140px;
  padding: 10px 16px;
  border: 1px solid black;
  background: transparent;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.profile-card__edit-button:hover {
  cursor: pointer;
  opacity: 0.8;
}

.profile-card__state {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #333;
}

.profile-card__state_error {
  color: #a80000;
}

.profile-card__error-details {
  font-size: 14px;
  color: inherit;
  opacity: 0.8;
  overflow-wrap: anywhere;
}

.profile-card__state_guest {
  color: #333;
}

.profile-card__hint {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  color: #555;
}

.profile-card__link {
  color: inherit;
  text-decoration: underline;
}

.profile-card__link:hover {
  opacity: 0.8;
}

.profile-card__body {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-card__summary {
  display: flex;
  gap: 24px;
  align-items: center;
}

.profile-card__avatar {
  width: 160px;
  height: 160px;
  border-radius: 12px;
  object-fit: cover;
  border: 1px solid black;
}

.profile-card__primary-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.profile-card__name {
  font-size: 26px;
  font-weight: 600;
}

.profile-card__username {
  font-size: 18px;
  color: #555;
}

.profile-card__bio {
  max-width: 380px;
  color: #333;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.profile-card__details {
  display: grid;
  gap: 12px;
}

.profile-card__details-item {
  display: flex;
  gap: 4px;
}

.profile-card__details-item dt {
  min-width: 80px;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.06em;
  color: #888;
}

.profile-card__details-item dd {
  margin: 0;
  font-size: 16px;
  color: #222;
}

.profile-card__details-muted {
  font-size: 14px;
  color: #666;
  margin-left: 4px;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .profile-card {
    padding: 20px;
  }

  .profile-card__summary {
    flex-direction: column;
    align-items: flex-start;
  }

  .profile-card__avatar {
    width: 120px;
    height: 120px;
  }

  .profile-card__bio {
    max-width: none;
  }

  .profile-card__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .profile-card__edit-button {
    width: 100%;
  }
}
</style>
