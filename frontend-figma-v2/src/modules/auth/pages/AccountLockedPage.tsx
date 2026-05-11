import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { authStrings } from "@/modules/auth/strings";

export default function AccountLocked() {
  const t = authStrings.accountLocked;
  return (
    <AuthLayout>
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/15 text-destructive">
          <Lock className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">{t.title}</h1>
          <p className="text-sm text-muted-foreground">{t.description}</p>
        </div>
        <Button asChild size="lg" className="w-full">
          <Link to="/login">{t.cta}</Link>
        </Button>
        <p className="text-xs text-muted-foreground">{t.help}</p>
      </div>
    </AuthLayout>
  );
}
