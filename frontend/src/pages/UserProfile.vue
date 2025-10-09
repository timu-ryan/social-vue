<template>
  <div>
    Профиль пользователя:
    <pre>{{user}}</pre>
    загрузка: <pre>{{isLoading}}</pre>
    ошибка: <pre>{{error}}</pre>
  </div>
</template>

<script setup lang="ts">
import {computed, watchEffect} from 'vue'
import { useRoute } from 'vue-router'
import router from "@/router";
import {useUser} from "@/composables/useUser.ts";

const route = useRoute()

const username = computed(() => {
  const raw = route.params.username
  return Array.isArray(raw) ? raw[0] : raw
})

watchEffect(() => {
  if (!username.value) router.replace('/users')
})

const { user, isLoading, error } = useUser(username)

</script>

<style scoped>

</style>