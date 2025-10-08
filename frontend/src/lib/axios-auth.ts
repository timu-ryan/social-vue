import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { api } from './axios'
import { getRefresh, getLogout } from '@/api/auth-bridge'

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean }

let refreshing: Promise<string | void> | null = null

async function ensureRefreshed() {
  if (!refreshing) {
    const refresh = getRefresh()
    refreshing = refresh()
      .finally(() => { refreshing = null })
  }
  return refreshing
}

// отправка refresh token при ошибке 401
api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const status = error.response?.status
    const original = error.config as RetriableConfig | undefined

    // если это не 401, или нет исходного конфига — просто пробрасываем
    if (status !== 401 || !original) {
      return Promise.reject(error)
    }

    // не пытаемся рефрешить сам /auth/refresh
    const url = original.url || ''
    if (url.includes('/auth/refresh')) {
      const logout = getLogout()
      await logout()
      return Promise.reject(error)
    }

    const headers = original.headers ?? {}
    const authHeader = (headers.Authorization || headers.authorization) as string | undefined

    // если запрос изначально не нес access-токен (гость), рефреш не нужен
    if (!authHeader?.startsWith('Bearer ')) {
      return Promise.reject(error)
    }

    // повторяем 1 раз
    if (!original._retry) {
      original._retry = true
      try {
        await ensureRefreshed()
        // тут токен уже обновлён (в сторе), request-интерцептор подставит новый
        return api(original)
      } catch {
        const logout = getLogout()
        await logout()
        return Promise.reject(error)
      }
    }

    // второе падение 401 — выходим из сессии
    const logout = getLogout()
    await logout()
    return Promise.reject(error)
  }
)
