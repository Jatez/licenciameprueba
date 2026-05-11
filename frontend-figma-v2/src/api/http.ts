import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/authStore";

/**
 * Real HTTP client wired to the Licenciame backend.
 * Base URL: http://localhost:8000/api/v2
 */
export const http: AxiosInstance = axios.create({
  baseURL: (import.meta.env.VITE_API_URL ?? "http://localhost:8000") + "/api/v2",
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

/**
 * Request interceptor — injects the Bearer token from the auth store.
 * Reading from the store on every request keeps the token always fresh
 * (no stale closures after login/refresh).
 */
http.interceptors.request.use((config) => {
  let token = useAuthStore.getState().accessToken;
  // Fallback: try reading from localStorage directly (handles edge cases before store hydration)
  if (!token) {
    try {
      const raw = localStorage.getItem("licenciame-auth") ?? localStorage.getItem("auth-storage");
      if (raw) {
        const parsed = JSON.parse(raw);
        token = parsed?.state?.accessToken ?? null;
      }
    } catch {
      // ignore
    }
  }
  if (token && config.headers) {
    (config.headers as unknown as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Response interceptor — on 401 attempts a single silent refresh, retries
 * the original request, and on failure clears the session.
 */
let refreshing: Promise<string | null> | null = null;

async function attemptRefresh(): Promise<string | null> {
  const refreshToken = useAuthStore.getState().refreshToken;
  if (!refreshToken) return null;
  try {
    const { authApi } = await import("@/modules/auth/api");
    const tokens = await authApi.refresh(refreshToken);
    useAuthStore.getState().setTokens(tokens);
    return tokens.accessToken;
  } catch {
    return null;
  }
}

http.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err?.config as
      | (AxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (err?.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      refreshing = refreshing ?? attemptRefresh();
      const newToken = await refreshing;
      refreshing = null;
      if (newToken) {
        if (originalRequest.headers) {
          (originalRequest.headers as unknown as Record<string, string>).Authorization = `Bearer ${newToken}`;
        }
        return http.request(originalRequest);
      }
      useAuthStore.getState().logout();
    }

    // Backend returns ApiError shape { code, message, field? } in body.
    const data = err?.response?.data;
    if (data && typeof data === "object" && "code" in data && "message" in data) {
      return Promise.reject(data);
    }
    // FastAPI detail string errors
    if (data && typeof data === "object" && "detail" in data) {
      return Promise.reject({
        code: data.detail,
        message: data.detail,
      });
    }
    return Promise.reject({
      code: "network_error",
      message: err?.message ?? "Network error",
    });
  },
);
