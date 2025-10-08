<template>
  <div>
    <ul>
      <li v-for="(user, index) in users" :key="user.id">
        <span>{{index + 1}}</span>
        <p>username: {{user.username}}</p>
        <p>email: {{user.email}}</p>
        <br/>
      </li>
    </ul>

    <button v-if="hasNextPage" @click="() => fetchNextPage()">load more</button>
    <p v-else>а больше нет</p>
  </div>
</template>

<script setup lang="ts">

import {useUsersInfiniteQuery} from "@/composables/useUsersInfinityQuery.ts";
import {watchEffect} from "vue";

const {
  users,
  status,
  error,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
} = useUsersInfiniteQuery({ firstLimit: 10, pageLimit: 5 })


watchEffect(() => {
  console.log(users.value)
})

</script>

<style scoped>

</style>