import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authStrings } from "../../../strings";

export function VerifyEmailAlreadyVerified() {
  const t = authStrings.verifyEmail.alreadyVerified;
  return (
    <div className="space-y-5 text-center">
      <Mail className="mx-auto h-12 w-12 text-muted-foreground" aria-hidden="true" />
      <div className="space-y-1.5">
        <h1 className="text-xl font-semibold tracking-tight">{t.title}</h1>
        <p className="text-sm text-muted-foreground">{t.description}</p>
      </div>
      <Button asChild className="w-full">
        <Link to="/login">{t.cta}</Link>
      </Button>
    </div>
  );
}
