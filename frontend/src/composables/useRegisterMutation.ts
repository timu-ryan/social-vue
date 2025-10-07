import {useMutation} from "@tanstack/vue-query";
import type {RegisterRequest} from "@/types/auth.ts";
import {useAuthStore} from "@/stores/auth.ts";

export function useRegisterMutation() {
  const { register } = useAuthStore()

  return useMutation({
    mutationFn: (payload: RegisterRequest) => register(payload),
  })
}
