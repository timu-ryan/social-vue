import { defineStore } from 'pinia'
import { registerUser, loginUser, refreshToken, logoutUser } from '@/api/auth'
import type {
  RegisterRequest,
  LoginRequest,
} from '@/types/auth'

import { queryClient } from '@/lib/query'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: '' as string,
  }),
  getters: {
    isAuthed: (s) => !!s.accessToken,
  },
  actions: {
    async register(payload: RegisterRequest) {
      const data = await registerUser(payload)
      this.accessToken = data.accessToken
      return data.user
    },

    async login(payload: LoginRequest) {
      const data = await loginUser(payload)
      this.accessToken = data.accessToken
      return data.user
    },

    async refresh() {
      const { accessToken } = await refreshToken()
      this.accessToken = accessToken
      return accessToken
    },

    async logout() {
      try {
        await logoutUser()
      } finally {
        this.accessToken = ''
        queryClient.clear()
      }
    },

  },
})
