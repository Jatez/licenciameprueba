import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, CheckCircle2, Circle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/modules/auth/components/PasswordInput/PasswordInput";
import { AuthAlert } from "@/modules/auth/components/AuthAlert";
import { authStrings } from "@/modules/auth/strings";
import {
  evaluatePassword,
  passwordIsValid,
} from "@/modules/auth/utils/passwordPolicy";
import { useMockPasswordReset } from "@/modules/auth/hooks/useMockPasswordReset";
import { cn } from "@/lib/utils";

export function ResetPasswordForm() {
  const t = authStrings.resetPassword;
  const { updatePassword, isPending } = useMockPasswordReset();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [success, setSuccess] = useState(false);

  const checks = evaluatePassword(password, confirm);
  const valid = passwordIsValid(checks);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    await updatePassword(password);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-foreground">
          <Check className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">{t.success.title}</h1>
          <p className="text-sm text-muted-foreground">{t.success.description}</p>
        </div>
        <Button asChild size="lg" className="w-full">
          <Link to="/login">{t.success.cta}</Link>
        </Button>
      </div>
    );
  }

  const requirements = [
    { ok: checks.length, label: t.requirements.length },
    { ok: checks.uppercase, label: t.requirements.uppercase },
    { ok: checks.number, label: t.requirements.number },
    { ok: checks.match, label: t.requirements.match },
  ];

  const showMismatch = confirm.length > 0 && !checks.match;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{t.title}</h1>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {showMismatch ? <AuthAlert description={t.errors.MISMATCH} /> : null}

        <div className="space-y-2">
          <Label htmlFor="newPassword">{t.fields.newPassword.label}</Label>
          <PasswordInput
            id="newPassword"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{t.fields.confirmPassword.label}</Label>
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        <ul className="space-y-1.5 rounded-md bg-muted/50 p-3">
          {requirements.map((r) => (
            <li
              key={r.label}
              className={cn(
                "flex items-center gap-2 text-xs",
                r.ok ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {r.ok ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-foreground" aria-hidden="true" />
              ) : (
                <Circle className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {r.label}
            </li>
          ))}
        </ul>

        <Button type="submit" size="lg" className="w-full" disabled={!valid || isPending}>
          {isPending ? t.submitting : t.submit}
        </Button>

        <Link
          to="/login"
          className="flex items-center justify-center gap-1 text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Volver a iniciar sesión
        </Link>
      </form>
    </div>
  );
}
