import { computed, unref, type MaybeRef } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { useAuthStore } from '@/stores/auth'
import { fetchUser } from '@/api/user'

export function useUser(username: MaybeRef<string | undefined>) {
  const auth = useAuthStore()
  const uname = computed(() => unref(username))

  const query = useQuery({
    // кэш на пользователя
    queryKey: computed(() => ['userProfile', uname.value]),
    queryFn: () => fetchUser(uname.value!), // вызывается только если enabled === true
    enabled: computed(() => !!auth.accessToken && !!uname.value),
    staleTime: 60_000,
  })

  return {
    user: computed(() => query.data.value),
    isLoading: query.isLoading,
    error: query.error,
  }
}