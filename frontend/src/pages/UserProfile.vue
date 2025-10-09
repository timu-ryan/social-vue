<template>
  <section class="user-profile-page">
    <UserProfileCard
      :user="user"
      :is-loading="isLoading"
      :error="error"
      :title="profileTitle"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'
import { useUser } from '@/composables/useUser.ts'
import UserProfileCard from '@/components/UserProfileCard.vue'

const route = useRoute()

const username = computed(() => {
  const raw = route.params.username
  return Array.isArray(raw) ? raw[0] : raw
})

watchEffect(() => {
  if (!username.value) router.replace('/users')
})

const { user, isLoading, error } = useUser(username)

const profileTitle = computed(() => {
  if (username.value) return `Профиль @${username.value}`
  return 'Профиль пользователя'
})
</script>

<style scoped>
.user-profile-page {
  width: 100%;
  padding: 40px 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
</style>
