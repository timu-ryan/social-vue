<template>
  <div class="card">
    <img
        v-if="user.avatarUrl"
        class="card__avatar"
        :src="user.avatarUrl"
        alt="аватар"
        height="140"
        width="140"
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
      <div>
        <p>Имя: {{user.displayName || "аноним"}}</p>
        <p>username: <span class="card__username">{{user.username}}</span></p>
        <p class="card__email">email: {{user.email}}</p>
        <p class="card__description">описание: {{user.bio || "не привел"}}</p>
      </div>
      <p>создан: {{createdAtParsed}} ({{createdAgo}})</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/types/user'
import { formatInMoscow, formatRelative } from '@/utils'
import {computed} from "vue";

const props = defineProps<{
  user: User;
}>()

const createdAtParsed = computed(() => formatInMoscow(props.user.createdAt))
const createdAgo = computed(() => formatRelative(props.user.createdAt))
</script>

<style scoped>
.card {
  display: flex;
  gap: 10px;
  padding: 12px 20px 12px 12px;
  border: 1px solid black;
  border-radius: 10px;
  transition: transform 0.1s ease-in-out;
}

.card:hover {
  transform: scale(1.02);
  cursor: pointer;
}

.card:hover .card__username {
  text-decoration: underline;
}

.card__avatar {
  width: 140px;
  height: 140px;
  border-radius: 6px;
}

.card__info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card__description {
  /* для многострочного ellipsis */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;   /* сколько строк оставить */
  line-clamp: 3;           /* прогрессивно (где поддерживается) */
  overflow: hidden;

  /* полезно для длинных слов */
  overflow-wrap: anywhere;
}

</style>