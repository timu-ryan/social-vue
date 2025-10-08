import { api } from '@/lib/axios'

import type {
  AuthResponse,
  RegisterRequest,
  LoginRequest,
  RefreshResponse,
} from "@/types/auth.ts";

export async function registerUser(registerData: RegisterRequest) {
  return api.post<AuthResponse>('/api/auth/register', registerData, {
    headers: {
      'Content-Type': 'application/json',
    }
  }).then((res) => res.data)
}

export async function loginUser(loginData: LoginRequest) {
  return api.post<AuthResponse>('/api/auth/login', loginData, {
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => res.data)
}

export async function refreshToken() {
  return api.post<RefreshResponse>('/api/auth/refresh')
    .then(res => res.data)
}

export async function logoutUser() {
  return api.post<void>('/api/auth/logout')
    .then(res => res.data)
}
