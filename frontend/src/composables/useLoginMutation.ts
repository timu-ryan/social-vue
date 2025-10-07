import {useMutation} from "@tanstack/vue-query";
import type {LoginRequest} from "@/types/auth.ts";
import {useAuthStore} from "@/stores/auth.ts";

export function useLoginMutation() {
  const { login } = useAuthStore()

  return useMutation({
    mutationFn: (payload: LoginRequest) => login(payload),
  })
}
