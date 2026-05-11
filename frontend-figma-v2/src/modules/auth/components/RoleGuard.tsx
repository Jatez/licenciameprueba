import { useAuth } from "../hooks/useAuth";
import type { UserRole } from "@/api/types";

interface Props {
  /** Roles allowed to see the children. */
  allow: UserRole[];
  children: React.ReactNode;
  /** Optional fallback when the user's role is not in `allow`. */
  fallback?: React.ReactNode;
}

/**
 * Conditional UI gate by role. Hides children unless the current user's role
 * is in `allow`. Renders `fallback` (or null) otherwise.
 */
export function RoleGuard({ allow, children, fallback = null }: Props) {
  const { user } = useAuth();
  if (!user || !allow.includes(user.role)) return <>{fallback}</>;
  return <>{children}</>;
}