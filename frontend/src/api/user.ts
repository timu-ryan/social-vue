import { api } from '@/lib/axios'
import type { AuthUser } from '@/types/user'

export async function fetchMe() {
  const res = await api.get<{ user: AuthUser}>('/api/auth/me')
  const user = res.data.user

  return user
}
