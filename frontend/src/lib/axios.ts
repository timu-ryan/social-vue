import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:4000',
  withCredentials: true, // чтобы refresh-cookie уходила на /api/auth/*
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