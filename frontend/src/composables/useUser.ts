import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { fetchMe } from '@/api/user'

export function useUserQuery() {
  const auth = useAuthStore()

  return useQuery({
    queryKey: ['user'],
    queryFn: fetchMe,
    enabled: computed(() => !!auth.accessToken),
    staleTime: 5 * 60 * 1000,
  })
}
