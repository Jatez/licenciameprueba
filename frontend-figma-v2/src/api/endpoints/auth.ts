/**
 * Auth endpoints — wired to the real backend.
 *
 * Backend prefix: /api/v2/auth
 *
 * Mapping:
 *   register()            → POST /auth/register
 *   verifyEmail()         → not implemented in backend (no email verification flow)
 *   resendVerification()  → not implemented in backend
 *   getCurrentUser()      → GET  /auth/me
 *   completeOnboarding()  → not implemented in backend (frontend-only concept)
 *   skipOnboarding()      → not implemented in backend (frontend-only concept)
 *   listOnboardingSteps() → static, no HTTP call needed
 *
 * NOTE: verifyEmail, resendVerification, completeOnboarding, skipOnboarding
 * have no backend equivalent — they return no-op stubs that satisfy the UI.
 */

import { http } from "../http";
import { mockOnboardingSteps } from "../mocks/auth.mocks";
import type {
  CompleteOnboardingRequest,
  CompleteOnboardingResponse,
  RegisterRequest,
  RegisterResponse,
  ResendVerificationRequest,
  ResendVerificationResponse,
  SkipOnboardingResponse,
  User,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from "../types";

// ─── Field-name adapters (snake_case backend → camelCase frontend) ────────────

function mapUser(u: Record<string, unknown>): User {
  return {
    id: String(u.id),
    email: String(u.email),
    fullName: u.full_name ? String(u.full_name) : String(u.email), // prefer backend full_name if available
    role: (u.role as User["role"]) ?? "company_admin",
    companyId: u.company_id ? String(u.company_id) : "",
    emailVerified: true, // backend activates on register
    onboardingCurrentStep: 0,
    onboardingCompleted: false,
    onboardingSkipped: false,
    createdAt: String(u.created_at ?? new Date().toISOString()),
  };
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

export async function register(payload: RegisterRequest): Promise<RegisterResponse> {
  const res = await http.post("/auth/register", {
    email: payload.email,
    password: payload.password,
    company_name: payload.companyName,
    country_code: payload.countryCode,
  });

  const data = res.data as Record<string, unknown>;

  // After register, fetch user + company
  const tokens = {
    accessToken: String(data.access_token),
    refreshToken: String(data.refresh_token),
  };

  // Temporarily set token so subsequent calls work
  const { useAuthStore } = await import("@/stores/authStore");
  useAuthStore.getState().setTokens(tokens);

  const [meRes, companyRes] = await Promise.all([
    http.get("/auth/me"),
    http.get("/auth/company").catch(() => ({ data: null })),
  ]);

  const user = mapUser(meRes.data as Record<string, unknown>);
  const companyData = companyRes.data as Record<string, unknown> | null;
  const company = companyData
    ? {
        id: String(companyData.id),
        name: String(companyData.name),
        countryCode: String(companyData.country_code),
        createdAt: String(companyData.created_at),
      }
    : {
        id: user.companyId,
        name: payload.companyName,
        countryCode: payload.countryCode,
        createdAt: new Date().toISOString(),
      };

  return {
    user,
    company,
    tokens,
    verificationEmailSent: false,
  };
}

export async function verifyEmail(_payload: VerifyEmailRequest): Promise<VerifyEmailResponse> {
  // No backend endpoint for email verification — return current user as-is.
  const user = await getCurrentUser();
  return { user };
}

export async function resendVerification(
  _payload: ResendVerificationRequest,
): Promise<ResendVerificationResponse> {
  // No backend endpoint for resending verification.
  const nextRetry = new Date(Date.now() + 60_000).toISOString();
  return { sent: true, nextRetryAvailableAt: nextRetry };
}

export async function getCurrentUser(): Promise<User> {
  const res = await http.get("/auth/me");
  return mapUser(res.data as Record<string, unknown>);
}

export async function completeOnboarding(
  _payload: CompleteOnboardingRequest,
): Promise<CompleteOnboardingResponse> {
  // No backend endpoint for onboarding state — return current user.
  const user = await getCurrentUser();
  return { user: { ...user, onboardingCompleted: true, onboardingCurrentStep: 4 } };
}

export async function skipOnboarding(): Promise<SkipOnboardingResponse> {
  // No backend endpoint for onboarding skip — return current user.
  const user = await getCurrentUser();
  return { user: { ...user, onboardingSkipped: true, onboardingCurrentStep: 4 } };
}

/** Static catalog of onboarding steps. Sync, no HTTP call. */
export function listOnboardingSteps() {
  return mockOnboardingSteps;
}
