<template>
  <div class="users-page">
    <h2 class="heading">Список пользователей: </h2>
    <p>поиск...</p>
    <ListTypePicker v-model:listType="pickedListType" />
    <ul class="users" :class="{ users_detailed: pickedListType === 'detailed' }" >
      <li v-for="(user, index) in users" :key="user.id" @click="() => router.push('/users/'+user.username)">
        <UserCard v-if="pickedListType === 'common'" :user="user" />
        <DetailedUserCard v-else :user="user" />
      </li>
    </ul>

    <!-- Сентинел для IntersectionObserver -->
    <div
      v-if="hasNextPage"
      aria-hidden="true"
      ref="loadMoreRef"
      style="height: 1px; width: 100%;"
    ></div>

    <button
      v-if="hasNextPage"
      @click="() => fetchNextPage()"
      :disabled="isFetchingNextPage"
      class="load-more-button"
    >
      {{ isFetchingNextPage ? 'загружаю…' : 'загрузить еще' }}
    </button>
    <p v-else class="no-more-users">Пользователей больше нет...</p>
  </div>
</template>

<script setup lang="ts">

import {useUsersInfinityQuery} from "@/composables/useUsersInfinityQuery.ts";
import {ref, watchEffect} from "vue";
import UserCard from "@/components/UserCard.vue";
import ListTypePicker from "@/components/ListTypePicker.vue";
import DetailedUserCard from "@/components/DetailedUserCard.vue";
import router from "@/router";
import {useInfiniteObserver} from "@/composables/useInfiniteObserver.ts";


const {
  users,
  status,
  error,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
} = useUsersInfinityQuery({ firstLimit: 10, pageLimit: 5 })

type TListType = 'detailed' | 'common'
const pickedListType = ref<TListType>('detailed')

const { loadMoreRef, isIOSupported } = useInfiniteObserver({
  hasNextPage,
  isLoading: isFetchingNextPage,
  onLoadMore: fetchNextPage,
  root: null,                 // по умолчанию — вьюпорт
  rootMargin: "400px 0px",    // прелоад за 400px до низа
  threshold: 0.01,
})

watchEffect(() => {

})

</script>

<style scoped>
.users-page {
  width: 100%;
}

.heading {
  margin: 20px 10px 10px;
}

.users {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  justify-content: center;
  gap: 10px;
  margin: 0 auto;
  padding: 0 10px;
}

.users_detailed {
  grid-template-columns: repeat(1, 1fr);
  padding: 0 40px;
}

@media (max-width: 800px) {
  .users {
    max-width: 600px;
    grid-template-columns: repeat(1, 1fr);
  }
}

.load-more-button {
  margin: 20px auto;
  display: block;
  padding: 8px 20px;
  border: 1px solid gray;
  border-radius: 5px;
  background: transparent;
}

.load-more-button:hover {
  cursor: pointer;
  opacity: 0.8;
}

.no-more-users {
  text-align: center;
  margin: 20px auto;
}
</style>