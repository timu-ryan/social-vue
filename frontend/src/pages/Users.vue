<template>
  <section class="users-page">
    <div class="users-page__container">
      <header class="users-page__header">
        <div class="users-page__heading">
          <h1 class="users-page__title">Пользователи</h1>
          <p class="users-page__subtitle">клик на пользователя, чтобы посмотреть профиль!</p>
        </div>
        <ListTypePicker v-model:listType="pickedListType" class="users-page__view-switcher" />
      </header>


      <div v-if="isInitialLoading" class="users-page__state">
        <span>загружаю пользователей…</span>
      </div>

      <div v-else-if="isError" class="users-page__state users-page__state_error">
        <span>что-то пошло не так</span>
        <span class="users-page__state-details">{{ error }}</span>
        <button type="button" class="users-page__retry" @click="handleRetry">попробовать ещё раз</button>
      </div>

      <div v-else-if="isEmpty" class="users-page__state">
        <span>никого не нашли</span>
        <span class="users-page__state-details">похоже, база ещё пополняется — загляни чуть позже</span>
      </div>

      <ul
        v-else
        class="users-page__list"
        :class="{ 'users-page__list_detailed': pickedListType === 'detailed' }"
      >
        <li
          v-for="user in users"
          :key="user.id"
          class="users-page__item"
          @click="openUserProfile(user.username)"
        >
          <UserCard v-if="pickedListType === 'common'" :user="user" />
          <DetailedUserCard v-else :user="user" />
        </li>
      </ul>

      <div
        v-if="showLoadMoreButton && isIOSupported"
        ref="loadMoreRef"
        class="users-page__sentinel"
        aria-hidden="true"
      ></div>

      <p v-if="showInlineLoader" class="users-page__state users-page__state_inline">
        загружаю ещё…
      </p>
    </div>

    <button
      v-if="showLoadMoreButton"
      @click="() => fetchNextPage()"
      :disabled="isFetchingNextPage"
      class="users-page__load-more"
    >
      {{ isFetchingNextPage ? 'загружаю…' : 'загрузить ещё' }}
    </button>

    <p v-if="showEndMessage" class="users-page__end">Больше пользователей пока нет.</p>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUsersInfinityQuery } from '@/composables/useUsersInfinityQuery.ts'
import UserCard from '@/components/UserCard.vue'
import ListTypePicker from '@/components/ListTypePicker.vue'
import DetailedUserCard from '@/components/DetailedUserCard.vue'
import router from '@/router'
import { useInfiniteObserver } from '@/composables/useInfiniteObserver.ts'

const {
  users,
  status,
  error,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  refetch,
} = useUsersInfinityQuery({ firstLimit: 10, pageLimit: 5 })

type TListType = 'detailed' | 'common'
const pickedListType = ref<TListType>('detailed')

const { loadMoreRef, isIOSupported } = useInfiniteObserver({
  hasNextPage,
  isLoading: isFetchingNextPage,
  onLoadMore: fetchNextPage,
  root: null,
  rootMargin: '400px 0px',
  threshold: 0.01,
})

const isInitialLoading = computed(() => status.value === 'pending' && users.value.length === 0)
const isError = computed(() => status.value === 'error')
const isEmpty = computed(() => !isInitialLoading.value && !isError.value && users.value.length === 0)
const hasMore = computed(() => !!hasNextPage.value)
const showLoadMoreButton = computed(() => hasMore.value && !isError.value)
const showInlineLoader = computed(() => isFetchingNextPage.value && !isError.value)
const showEndMessage = computed(() => !hasMore.value && !isInitialLoading.value && !isError.value && users.value.length > 0)


const handleRetry = () => {
  refetch()
}

const openUserProfile = (username: string | null) => {
  if (!username) return
  router.push(`/users/${username}`)
}
</script>

<style scoped>
.users-page {
  width: 100%;
  padding: 40px 20px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  color: var(--color-text-primary);
}

.users-page__container {
  width: 100%;
  max-width: 1200px;
  padding: 32px 36px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.users-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.users-page__heading {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.users-page__title {
  font-size: 28px;
  font-weight: 600;
}

.users-page__subtitle {
  font-size: 15px;
  color: var(--color-text-muted);
}

.users-page__view-switcher {
  padding: 10px 14px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  gap: 12px;
}

.users-page__view-switcher :deep(label) {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-secondary);
}

.users-page__view-switcher :deep(input) {
  margin-left: 4px;
  accent-color: var(--color-text-primary);
}

.users-page__view-switcher :deep(label):hover {
  cursor: pointer;
}

.users-page__view-switcher :deep(input):hover {
  cursor: pointer;
}


.users-page__state {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--color-text-primary);
}

.users-page__state_inline {
  display: block;
  margin: 0;
  padding: 0;
  font-size: 14px;
  color: var(--color-text-muted);
}

.users-page__state_error {
  color: var(--color-error);
}

.users-page__state-details {
  font-size: 14px;
  color: inherit;
  opacity: 0.75;
  overflow-wrap: anywhere;
}

.users-page__retry {
  align-self: flex-start;
  padding: 8px 16px;
  border: 1px solid var(--color-border);
  background: transparent;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.users-page__retry:hover {
  cursor: pointer;
  opacity: 0.8;
}

.users-page__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.users-page__list_detailed {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.users-page__item {
  cursor: pointer;
}

.users-page__item:focus-within,
.users-page__item:focus {
  outline: none;
}

.users-page__sentinel {
  height: 1px;
  width: 100%;
}

.users-page__load-more {
  padding: 12px 26px;
  border: 1px solid var(--color-border);
  background: transparent;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: inherit;
}

.users-page__load-more:hover {
  cursor: pointer;
  opacity: 0.8;
}

.users-page__load-more:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.users-page__end {
  font-size: 14px;
  color: var(--color-text-muted);
  text-align: center;
}

@media (max-width: 960px) {
  .users-page__list {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .users-page__container {
    padding: 24px 20px;
  }

  .users-page__view-switcher {
    width: 100%;
    justify-content: space-between;
  }
}

@media (max-width: 480px) {
  .users-page {
    padding: 30px 16px 40px;
  }

  .users-page__container {
    gap: 20px;
  }
}
</style>
