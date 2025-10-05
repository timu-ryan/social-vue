<template>
  <header class="header">
    <div class="header__content">
      <div class="header__logo">
        <RouterLink to="/" class="header__link">Social vue</RouterLink>
      </div>
      <nav class="header__nav">
        <RouterLink to="/login" class="header__link">Login</RouterLink>
        <RouterLink to="/register" class="header__link">Register</RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">

</script>

<style scoped>
  .header {
    width: 100%;
    height: 60px;
    border-bottom: 1px solid grey;
  }

  .header__content {
    width: 100%;
    height: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header__logo {

  }

  .header__link {
    text-decoration: none;
    color: black;
  }

  .header__link:hover {
    text-decoration: underline;
  }

  .header__nav {
    display: flex;
    gap: 16px;
  }
</style>