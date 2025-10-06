import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";


const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";


export const api = axios.create({
  baseURL,
  withCredentials: true, // шлём/получаем refresh-куку
});


let accessToken: string | null = null;
const tokenListeners = new Set<(t: string | null) => void>();


export function setAccessToken(t: string | null) {
  accessToken = t;
  tokenListeners.forEach((fn) => fn(t));
}
export function onAccessTokenChange(fn: (t: string | null) => void) {
  tokenListeners.add(fn);
  return () => tokenListeners.delete(fn);
}


api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let waiting: Array<(token: string | null) => void> = [];


async function rawRefresh(): Promise<string> {
  const resp = await axios.post<{ accessToken: string }>(
    `${baseURL}/auth/refresh`,
    {},
    { withCredentials: true }
  );
  return resp.data.accessToken;
}

api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original: any = error.config || {};
    const url = (original.url || "") as string;

    // Не пытаемся рефрешить сами /auth-* запросы и уже отретрайнутый запрос
    const isAuthEndpoint = url.includes("/auth/");

    if (status === 401 && !original._retry && !isAuthEndpoint) {
      original._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await rawRefresh();
          setAccessToken(newToken);
          waiting.forEach((fn) => fn(newToken));
          waiting = [];
        } catch (e) {
          setAccessToken(null);
          waiting.forEach((fn) => fn(null));
          waiting = [];
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        waiting.push((token) => {
          if (!token) {
            reject(error);
            return;
          }
          if (!original.headers) original.headers = {};
          original.headers["Authorization"] = `Bearer ${token}`;
          resolve(api(original));
        });
      });
    }

    return Promise.reject(error);
  }
);