import axios from 'axios'
import { getToken } from '@/api/token-getter'

export const api = axios.create({
  baseURL: 'http://localhost:4000',
  withCredentials: true, // чтобы refresh-cookie уходила на /api/auth/*
})

// добавить токен при каждом запросе
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// нормализация ошибок
api.interceptors.response.use(
  (r) => r,
  (error) => {
    // пробрасываем только нужные поля
    const status = error.response?.status
    const message = error.response?.data?.message ?? error.message
    return Promise.reject(Object.assign(error, { status, message }))
  }
)