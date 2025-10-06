<template>
  <div class="input-container">
    <input
      class="input-field"
      v-model="value"
      :type="type || 'text'"
      v-bind="$attrs"
      :id="name"
      :name="name"
      ref="inputEl"
    />
    <span
      class="input-error"
    >
      {{ errorMessage || '\u00A0' }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useField } from 'vee-validate';

const props = defineProps({
  name: String,
  type: String,
  autoFocus: Boolean,
});

// The `name` is returned in a function because we want to make sure it stays reactive
// If the name changes you want `useField` to be able to pick it up
const { value, errorMessage } = useField(() => props.name);

const inputEl = ref<HTMLInputElement | null>(null)

onMounted(() => {
  if (props.autoFocus) inputEl.value?.focus()
})
</script>

<style scoped>
.input-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.input-field {
  height: 36px;
  padding: 0 6px;
}

.input-error {
  min-height: 1.2em;
  margin-left: 6px;
  font-size: 0.9em;
  color: red;
}

</style>