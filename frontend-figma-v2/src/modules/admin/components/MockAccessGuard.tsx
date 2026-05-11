import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMockSession } from "@/modules/auth/hooks/useMockSession";
import { adminStrings } from "../strings";

interface MockAccessGuardProps {
  children: ReactNode;
  /** Override required role for testing. */
  requiredRole?: "super_admin";
}

/**
 * MOCK ONLY — UI-level role gate. Reads the F-02 mock session.
 * Replace with real auth/role middleware when backend exists.
 */
export function MockAccessGuard({ children, requiredRole = "super_admin" }: MockAccessGuardProps) {
  const { session } = useMockSession();
  const t = adminStrings.guard;

  const allowed = session?.role === requiredRole;
  if (allowed) return <>{children}</>;

  return (
    <main className="min-h-[100dvh] grid place-items-center bg-sidebar-bg px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <span className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-warning-subtle text-foreground">
            <ShieldOff className="h-5 w-5" aria-hidden="true" />
          </span>
          <CardTitle className="text-xl">{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button asChild>
            <Link to="/login">{t.ctaLogin}</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/">{t.ctaHome}</Link>
          </Button>
          <p className="text-xs text-muted-foreground text-center pt-2">{t.note}</p>
        </CardContent>
      </Card>
    </main>
  );
}
