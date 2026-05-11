import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface Props {
  children: React.ReactNode;
  /** Where to send unauthenticated users. Defaults to /login. */
  redirectTo?: string;
}

/**
 * Gate that redirects to /login when there's no auth token in the store.
 * Preserves the attempted location so post-login can return the user back.
 */
export function ProtectedRoute({ children, redirectTo = "/login" }: Props) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }
  return <>{children}</>;
}