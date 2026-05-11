import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authStrings } from "../../../strings";

export function VerifyEmailSuccess() {
  const t = authStrings.verifyEmail.success;
  return (
    <div className="space-y-5 text-center">
      <CheckCircle2 className="mx-auto h-12 w-12 text-primary" aria-hidden="true" />
      <div className="space-y-1.5">
        <h1 className="text-xl font-semibold tracking-tight">{t.title}</h1>
        <p className="text-sm text-muted-foreground">{t.description}</p>
      </div>
      <Button asChild className="w-full">
        <Link to="/dashboard03">{t.cta}</Link>
      </Button>
    </div>
  );
}
