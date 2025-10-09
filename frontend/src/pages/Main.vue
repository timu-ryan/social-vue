<template>
  <section class="main-page">
    <UserProfileCard
      :user="user"
      :is-loading="isLoading"
      :error="error"
      :can-edit="canEditProfile"
      :show-guest-cta="isGuest"
      title="Мой профиль"
      @edit="openEditPopup"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMe } from '@/composables/useMe.ts'
import { useAuthStore } from '@/stores/auth'
import UserProfileCard from '@/components/UserProfileCard.vue'

const { user, error, isLoading } = useMe()

const isEditPopupOpen = ref(false)

const auth = useAuthStore()

const isGuest = computed(() => !auth.isAuthed)

const canEditProfile = computed(() => !!user.value)

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
  align-items: flex-start;
}

</style>
