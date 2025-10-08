import {useMutation, useQueryClient} from "@tanstack/vue-query";
import {useRouter} from "vue-router";
import {useAuthStore} from "@/stores/auth.ts";


export function useLogout() {
  const router = useRouter()
  const auth = useAuthStore()
  const queryClient = useQueryClient()

  const {
    mutate: logout,
    isPending,
    error
  } = useMutation({
    mutationFn: () => auth.logout(),
    onSuccess: () => {
      queryClient.clear()
      router.push('/login')
    },
  })

  return {
    logout,
    isPending,
    error,
  }
}