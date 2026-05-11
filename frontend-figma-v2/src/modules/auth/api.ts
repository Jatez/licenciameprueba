/**
 * Auth module API — wired to the real backend.
 *
 * Mapping:
 *   login()           → POST /auth/login
 *   register()        → POST /auth/register
 *   logout()          → POST /auth/logout
 *   refresh()         → POST /auth/refresh
 *   getCurrentUser()  → GET  /auth/me
 *   getCompany()      → GET  /companies/:id  (derived from me.company_id)
 *   verifyEmail()     → stub (no backend endpoint)
 *   onboarding*()     → stubs (frontend-only concept)
 */

import axios from "axios";
import { useAuthStore } from "@/stores/authStore";
import type {
  AuthTokens,
  Company,
  RegisterRequest,
  RegisterResponse,
  ResendVerificationRequest,
  ResendVerificationResponse,
  User,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from "@/api/types";

const BASE_URL = "http://localhost:8000/api/v2";

// ─── Plain axios instance (no interceptors) ───────────────────────────────────
// Used for auth calls that MUST NOT be retried with an interceptor.

const authHttp = axios.create({ baseURL: BASE_URL });

// ─── Adapters: backend snake_case → frontend camelCase ────────────────────────

function mapUser(d: Record<string, unknown>): User {
  return {
    id: String(d.id),
    email: String(d.email ?? ""),
    fullName: d.full_name ? String(d.full_name) : "",
    role: (d.role ?? "creator") as User["role"],
    companyId: String(d.company_id ?? ""),
    emailVerified: true, // always treat as verified — no email flow in backend yet
    onboardingCurrentStep: Number(d.onboarding_current_step ?? 4),
    onboardingCompleted: Boolean(d.onboarding_completed ?? true),
    onboardingSkipped: Boolean(d.onboarding_skipped ?? false),
    createdAt: String(d.created_at ?? new Date().toISOString()),
  };
}

function mapCompany(d: Record<string, unknown>): Company {
  return {
    id: String(d.id),
    name: String(d.name ?? d.company_name ?? ""),
    countryCode: String(d.country_code ?? "CO"),
    createdAt: String(d.created_at ?? new Date().toISOString()),
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const authApi = {
  async login(
    email: string,
    password: string,
  ): Promise<{ user: User; tokens: AuthTokens }> {
    const res = await authHttp.post("/auth/login", { email, password });
    const d = res.data as Record<string, unknown>;

    const tokens: AuthTokens = {
      accessToken: String(d.access_token),
      refreshToken: String(d.refresh_token),
    };

    // Persist tokens before fetching the user profile.
    useAuthStore.getState().setTokens(tokens);

    const userRes = await authHttp.get("/auth/me", {
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
    });
    const user = mapUser(userRes.data as Record<string, unknown>);

    return { user, tokens };
  },

  async register(payload: RegisterRequest): Promise<RegisterResponse> {
    const res = await authHttp.post("/auth/register", {
      email: payload.email,
      password: payload.password,
      company_name: payload.companyName,
      country_code: payload.countryCode ?? "CO",
      // full_name and role are frontend-only fields; backend ignores them.
    });
    const d = res.data as Record<string, unknown>;

    const tokens: AuthTokens = {
      accessToken: String(d.access_token),
      refreshToken: String(d.refresh_token),
    };

    useAuthStore.getState().setTokens(tokens);

    const userRes = await authHttp.get("/auth/me", {
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
    });
    const user = mapUser(userRes.data as Record<string, unknown>);

    return { user, tokens };
  },

  async logout(): Promise<void> {
    const { accessToken, refreshToken } = useAuthStore.getState();
    try {
      await authHttp.post(
        "/auth/logout",
        { refresh_token: refreshToken },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
    } finally {
      // Always clear local session regardless of server response.
      useAuthStore.getState().clearAuth();
    }
  },

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const res = await authHttp.post("/auth/refresh", { refresh_token: refreshToken });
    const d = res.data as Record<string, unknown>;
    return {
      accessToken: String(d.access_token),
      refreshToken: String(d.refresh_token ?? refreshToken),
    };
  },

  async getCurrentUser(): Promise<User> {
    const { accessToken } = useAuthStore.getState();
    const res = await authHttp.get("/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return mapUser(res.data as Record<string, unknown>);
  },

  async getCompany(companyId: string): Promise<Company> {
    const { accessToken } = useAuthStore.getState();
    const res = await authHttp.get(`/companies/${companyId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return mapCompany(res.data as Record<string, unknown>);
  },

  async verifyEmail(payload: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    // No backend endpoint for email verification yet — treat as already verified.
    const user = await authApi.getCurrentUser();
    return { user: { ...user, emailVerified: true } };
  },

  async resendVerification(
    _payload: ResendVerificationRequest,
  ): Promise<ResendVerificationResponse> {
    // No backend endpoint yet — return success stub.
    return { sent: true };
  },

  // ─── Onboarding (frontend-only concept, no backend endpoint) ───────────────

  async completeOnboardingStep(stepId: string): Promise<User> {
    const user = await authApi.getCurrentUser();
    const step = parseInt(stepId, 10) || 4;
    return { ...user, onboardingCurrentStep: step };
  },

  async skipOnboarding(): Promise<User> {
    const user = await authApi.getCurrentUser();
    return { ...user, onboardingSkipped: true, onboardingCompleted: true, onboardingCurrentStep: 4 };
  },

  async completeOnboarding(): Promise<User> {
    const user = await authApi.getCurrentUser();
    return { ...user, onboardingCompleted: true, onboardingCurrentStep: 4 };
  },
};
