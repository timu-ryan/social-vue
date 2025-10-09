<script setup lang="ts">
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import {VueQueryDevtools} from "@tanstack/vue-query-devtools";
</script>

<template>
  <Header />
  <main class="main">
    <RouterView />
  </main>
  <Footer />
  <VueQueryDevtools />
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}

body {
  background: var(--color-bg-surface);
  color: var(--color-text-primary);
  min-height: 100vh;
  transition: background 0.3s ease, color 0.3s ease;
}

a {
  color: var(--color-link);
}

button {
  color: inherit;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main {
  flex-grow: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
}

</style>
