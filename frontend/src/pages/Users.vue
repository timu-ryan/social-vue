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

    <button v-if="hasNextPage" @click="() => fetchNextPage()">load more</button>
    <p v-else>а больше нет</p>
  </div>
</template>

<script setup lang="ts">

import {useUsersInfinityQuery} from "@/composables/useUsersInfinityQuery.ts";
import {ref, watchEffect} from "vue";
import UserCard from "@/components/UserCard.vue";
import ListTypePicker from "@/components/ListTypePicker.vue";
import DetailedUserCard from "@/components/DetailedUserCard.vue";
import router from "@/router";


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
</style>