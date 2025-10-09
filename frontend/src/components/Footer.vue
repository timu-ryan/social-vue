<template>
  <footer class="footer">
    <div class="footer__content">
      <div class="footer__brand">
        <span class="footer__title">Social vue</span>
      </div>

      <nav class="footer__nav">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="footer__link"
          activeClass="footer__link_active"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <p class="footer__meta">© {{ currentYear }} tim.social</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()

const links = [
  { label: 'Главная', to: '/' },
  { label: 'Пользователи', to: '/users' },
]
</script>

<style scoped>
.footer {
  width: 100%;
  border-top: 1px solid black;
  background: #f6f6f6;
}

.footer__content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px;
  display: flex;
  align-items: center;
  gap: 32px;
}

.footer__brand {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.footer__title {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.footer__tagline {
  font-size: 14px;
  color: #555;
}

.footer__nav {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;
}

.footer__link {
  text-decoration: none;
  color: #333;
  font-size: 15px;
}

.footer__link:hover {
  text-decoration: underline;
}

.footer__link_active {
  text-decoration: underline;
}

.footer__meta {
  font-size: 14px;
  color: #666;
}

@media (max-width: 720px) {
  .footer__content {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .footer__nav {
    margin-left: 0;
    flex-wrap: wrap;
  }
}
</style>
