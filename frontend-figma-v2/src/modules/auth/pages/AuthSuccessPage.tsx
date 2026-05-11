import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { authStrings } from "@/modules/auth/strings";
import { ROLE_HOME, mockSessionStorage, type MockRole } from "@/modules/auth/mocks/authMockSession";

export default function AuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const t = authStrings.authSuccess;

  useEffect(() => {
    const stateRole = (location.state as { role?: MockRole } | null)?.role;
    const role = stateRole ?? mockSessionStorage.read()?.role;
    const target = role ? ROLE_HOME[role] : "/login";
    const id = window.setTimeout(() => navigate(target, { replace: true }), 700);
    return () => window.clearTimeout(id);
  }, [navigate, location.state]);

  return (
    <AuthLayout>
      <div className="space-y-4 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-foreground" aria-hidden="true" />
        <h1 className="text-2xl font-semibold tracking-tight">{t.title}</h1>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
      </div>
    </AuthLayout>
  );
}
