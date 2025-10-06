<script setup lang="ts">
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
</script>

<template>
  <Header />
  <main class="main">
    <RouterView />
  </main>
  <Footer />
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;

  font-family: "Avenir", Helvetica, Arial, sans-serif;
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
