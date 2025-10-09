<template>
  <section class="main-page">
    <article class="profile-card">
      <header class="profile-card__header">
        <h1 class="profile-card__title">Мой профиль</h1>
        <button
          type="button"
          class="profile-card__edit-button"
          :disabled="!canEditProfile"
          @click="openEditPopup"
        >
          изменить
        </button>
      </header>

      <p v-if="isLoading" class="profile-card__state">загружаю профиль…</p>

      <div v-else-if="error" class="profile-card__state profile-card__state_error">
        <span>не удалось загрузить профиль</span>
        <span class="profile-card__error-details">{{ error }}</span>
      </div>

      <div v-else-if="user" class="profile-card__body">
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

      <p v-else class="profile-card__state">пользователь не найден</p>
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMe } from '@/composables/useMe.ts'
import { formatInMoscow, formatRelative } from '@/utils'

const { user, error, isLoading } = useMe()

const isEditPopupOpen = ref(false)

const canEditProfile = computed(() => !!user.value)

const avatarSrc = computed(() => {
  if (user.value?.avatarUrl) return user.value.avatarUrl
  return '/user-avatar.png'
})

const displayName = computed(() => user.value?.displayName || 'аноним')
const usernameLabel = computed(() => `@${user.value?.username || 'NotFound404'}`)
const bioText = computed(() => user.value?.bio || 'описание пока пустует')
const emailText = computed(() => user.value?.email ?? '—')

const createdAtFormatted = computed(() => {
  if (!user.value?.createdAt) return ''
  return formatInMoscow(user.value.createdAt)
})

const createdAgo = computed(() => {
  if (!user.value?.createdAt) return ''
  return formatRelative(user.value.createdAt)
})


const openEditPopup = () => {
  if (!canEditProfile.value) return
  isEditPopupOpen.value = true
  // TODO: подключить модалку редактирования пользователя
}
</script>

<style scoped>
.main-page {
  width: 100%;
  padding: 40px 20px;
  display: flex;
  justify-content: center;
  align-items: start;
}

.profile-card {
  width: 100%;
  max-width: 640px;
  border-bottom: 1px solid black;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
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

.profile-card__edit-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.profile-card__edit-button:not(:disabled):hover {
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
