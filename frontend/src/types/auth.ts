import type { AuthUser } from "@/types/user.ts";

export type AuthResponse = {
  accessToken: string;
  user: AuthUser
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

export interface LoginRequest {
  login: string;
  password: string;
}

export interface RefreshResponse {
  accessToken: string
}
