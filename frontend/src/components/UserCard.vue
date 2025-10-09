<template>
  <div class="card">
    <img
      v-if="user.avatarUrl"
      class="card__avatar"
      :src="user.avatarUrl"
      alt="аватар"
      height="80"
      width="80"
    />
    <img
      v-else
      class="card__avatar"
      src="/user-avatar.png"
      alt="аватар"
      height="512"
      width="512"
    />
    <div class="card__info">
      <p>Имя:<span class="card__name">{{user.displayName || "аноним"}}</span></p>
      <p class="card__email">email: {{user.email}}</p>
      <p class="card__description">описание: {{user.bio || "не привел"}}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/types/user'

defineProps<{
  user: User;
}>()

</script>

<style scoped>
.card {
  display: flex;
  gap: 10px;
  padding: 6px 20px 6px 6px;
  border: 1px solid black;
  border-radius: 10px;
  align-items: start;
  transition: transform 0.1s ease-in-out;
}

.card:hover {
  transform: scale(1.01);
  cursor: pointer;
}

.card:hover .card__name {
  text-decoration: underline;
}

.card__avatar {
  width: 80px;
  height: 80px;
  border-radius: 6px;
}

.card__description {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

</style>