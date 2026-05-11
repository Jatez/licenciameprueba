import { Loader2 } from "lucide-react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useCurrentUser } from "@/modules/packages/onboarding/hooks";

interface OnboardingGuardProps {
  children: React.ReactNode;
  /** Kept for backwards compatibility; the legacy onboarding redirect was removed
   *  in favor of the in-app product tour. The flag is currently a no-op. */
  requireOnboarding?: boolean;
}

/**
 * Route guard:
 *  - Not authenticated  → /login
 *  - Email not verified → /verify-email
 *
 * Onboarding completion is no longer enforced at the route level; the new tour
 * is delivered inside the app shell via OnboardingProvider.
 */
export function OnboardingGuard({ children }: OnboardingGuardProps) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const location = useLocation();
  const { data: user, isLoading } = useCurrentUser();

  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Email verification is bypassed in demo/dev mode — the backend marks all
  // accounts as verified on register. When a real email flow is added, remove
  // the `import.meta.env.DEV` escape hatch and enforce this in production only.
  if (!user.emailVerified && !import.meta.env.DEV) {
    return <Navigate to="/verify-email" replace />;
  }

  return <>{children}</>;
}
