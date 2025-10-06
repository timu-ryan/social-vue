import { defineStore } from "pinia";
import { api, setAccessToken, onAccessTokenChange } from "@/lib/api";


export type User = {
  id: string;
  email: string;
  username: string;
  displayName?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  createdAt: string;
};

type State = {
  accessToken: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  subscribed: boolean;
};

export const useAuthStore = defineStore("auth", {
  state: (): State => ({
    accessToken: null,
    user: null,
    loading: false,
    error: null,
    subscribed: false,
  }),
  getters: {
    isAuthenticated: (s) => !!s.accessToken,
  },
  actions: {
    _subscribeToken() {
      if (this.subscribed) return;
      this.subscribed = true;
      onAccessTokenChange((t) => {
        this.accessToken = t;
      });
    },


    async init() {
// Пытаемся восстановить сессию по refresh-куке при загрузке приложения
      this._subscribeToken();
      try {
        const { data } = await api.post<{ accessToken: string }>("/auth/refresh");
        setAccessToken(data.accessToken);
        await this.fetchMe();
      } catch (_) {
        setAccessToken(null);
        this.user = null;
      }
    },


    async fetchMe() {
      if (!this.accessToken) return;
      const { data } = await api.get<{ user: User }>("/auth/me");
      this.user = data.user;
    },

    async login(payload: { login: string; password: string }) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.post<{ accessToken: string; user: User }>(
          "/auth/login",
          payload
        );
        setAccessToken(data.accessToken);
        this.user = data.user;
      } catch (e: any) {
        this.error = e?.response?.data?.error || "Login failed";
        throw e;
      } finally {
        this.loading = false;
      }
    },


    async register(payload: { email: string; username: string; password: string }) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.post<{ accessToken: string; user: User }>(
          "/auth/register",
          payload
        );
        setAccessToken(data.accessToken);
        this.user = data.user;
      } catch (e: any) {
        this.error = e?.response?.data?.error || "Register failed";
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      try {
        await api.post("/auth/logout");
      } catch {}
      setAccessToken(null);
      this.user = null;
    },
  },
});
