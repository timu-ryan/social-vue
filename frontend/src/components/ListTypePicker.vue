<template>
  <div>
    <label for="detailed">детализированный:</label>
    <input
      id="detailed"
      type="radio"
      value="detailed"
      v-model="listType"
      name="listType"
    />
    <label for="common">обычный:</label>
    <input
      type="radio"
      value="common"
      id="common"
      v-model="listType"
      name="listType"
    />
  </div>
</template>

<script setup lang="ts">

type TListType = 'detailed' | 'common'

const listType = defineModel<TListType>('listType')

</script>

<style scoped>

</style>