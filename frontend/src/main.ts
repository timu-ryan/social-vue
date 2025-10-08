import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { queryClient } from '@/lib/query'

import App from './App.vue'
import router from './router'

import { useAuthStore } from "@/stores/auth.ts";
import { setTokenGetter } from '@/api/token-getter'
import { setAuthHandlers } from '@/api/auth-bridge'
import '@/lib/axios'                // регистрируем request-интерцептор
import '@/lib/axios-auth'           // регистрируем авто-refresh

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(VueQueryPlugin, { queryClient })

const authStore = useAuthStore(pinia)

setTokenGetter(() => authStore.accessToken)
setAuthHandlers({
  refresh: () => authStore.refresh(),
  logout: () => authStore.logout(),
})


try {
  await authStore.refresh()
} catch (e) {
  // console.log('гость') // гость
}

app.use(router)
await router.isReady()
app.mount('#app')
