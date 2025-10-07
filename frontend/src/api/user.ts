import { api } from '@/lib/axios'
import type { AuthUser } from '@/types/user'

export async function fetchMe() {
  const { data } = await api.get<AuthUser>('/api/auth/me')
  return data
}
