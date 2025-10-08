import { useQuery } from '@tanstack/vue-query'
import { useAuthStore } from '@/stores/auth'
import {computed} from "vue";
import { fetchMe } from '@/api/user'

export function useMe() {
  const auth = useAuthStore()

  const {
    data,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['user'],
    queryFn: fetchMe,
    enabled: computed(() => !!auth.accessToken),
    staleTime: 60_000,
  })

  const user = computed(() => data.value)
  return {
    user,
    isLoading,
    error,
  }
}
