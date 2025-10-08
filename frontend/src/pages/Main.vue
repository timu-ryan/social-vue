<template>
  <div>
    <h1>Main page</h1>
    data:
    <pre>{{user}}</pre>
    isLoading:
    <pre>{{isLoading}}</pre>
    error:
    <pre>{{error}}</pre>
  </div>
</template>

<script setup lang="ts">
import { useMe } from "@/composables/useMe.ts";

const {user, error, isLoading} = useMe();

</script>

<style scoped>

</style>