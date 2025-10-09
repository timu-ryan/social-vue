import { createRouter, createWebHistory } from 'vue-router'
import {useAuthStore} from "@/stores/auth.ts";
import Main from "@/pages/Main.vue";

const routes = [
  {
    path: '/',
    name: 'home',
    component: Main,
  },
  {
    path: '/login',
    name: 'login',
    component: () => import("@/pages/Login.vue"),
    meta: { guestOnly: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import("@/pages/Register.vue"),
    meta: { guestOnly: true },
  },
  {
    path: '/users',
    name: 'users',
    component: () => import("@/pages/Users.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: '/users/:username',
    name: 'userProfile',
    component: () => import("@/pages/UserProfile.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import("@/pages/NotFound.vue"),
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

router.beforeEach(async (to, from) => {
  const auth = useAuthStore()

  const isLoggedIn = auth.isAuthed

  // не зарегистрирован
  if (to.meta.requiresAuth && !isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // зарегистрирован
  if (to.meta.guestOnly && isLoggedIn) {
    return from.fullPath
  }

})

export default router
