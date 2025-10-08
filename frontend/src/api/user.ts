import { api } from '@/lib/axios'
import type { AuthUser } from '@/types/user'
import type { UsersResponse} from "@/types/user";

export async function fetchMe() {
  const res = await api.get<{ user: AuthUser}>('/api/auth/me')
  const user = res.data.user

  return user
}


export async function fetchUsersPage(offset = 0, limit = 5): Promise<UsersResponse> {
  const res = await api.get<UsersResponse>("/api/users", {
    params: {
      limit,
      offset
    }
  });

  return res.data;
}