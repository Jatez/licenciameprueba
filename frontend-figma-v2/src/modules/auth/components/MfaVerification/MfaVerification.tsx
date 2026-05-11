import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthAlert } from "@/modules/auth/components/AuthAlert";
import { authStrings } from "@/modules/auth/strings";
import {
  ROLE_HOME,
  maskEmail,
  pendingMfaStorage,
} from "@/modules/auth/mocks/authMockSession";
import { useMockMfa, type MfaErrorCode } from "@/modules/auth/hooks/useMockMfa";

export function MfaVerification() {
  const navigate = useNavigate();
  const t = authStrings.mfa;
  const [pending] = useState(() => pendingMfaStorage.read());
  const { verify, resend, cooldown, isPending } = useMockMfa(pending);
  const [code, setCode] = useState("");
  const [error, setError] = useState<MfaErrorCode | null>(null);
  const [resentNotice, setResentNotice] = useState(false);

  useEffect(() => {
    if (!pending) navigate("/login", { replace: true });
  }, [pending, navigate]);

  if (!pending) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResentNotice(false);
    const res = await verify(code);
    if (res.ok === false) {
      if (res.code === "TOO_MANY_ATTEMPTS") {
        navigate("/account-locked");
        return;
      }
      setError(res.code);
      return;
    }
    navigate("/auth-success", { state: { role: res.session.role } });
  };

  const handleResend = async () => {
    setError(null);
    await resend();
    setResentNotice(true);
    setCode("");
  };

  const goHome = () => navigate(ROLE_HOME[pending.role]);
  void goHome; // reserved: post-success redirect lives in /auth-success

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{t.title}</h1>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
        <p className="text-sm text-foreground">
          {t.sentTo.replace("{email}", maskEmail(pending.email))}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {error ? <AuthAlert description={t.errors[error]} /> : null}
        {resentNotice && !error ? (
          <AuthAlert tone="info" description={t.resendToast} />
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="otp">{t.codeLabel}</Label>
          <Input
            id="otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="••••••"
            className="text-center text-2xl font-semibold tracking-[0.5em]"
            aria-label={t.codeLabel}
          />
          <p className="text-xs text-muted-foreground">
            Demo: usa <span className="font-mono font-medium">123456</span>.
          </p>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isPending || code.length !== 6}>
          {isPending ? t.submitting : t.submit}
        </Button>

        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0}
            className="font-medium text-foreground underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
          >
            {cooldown > 0
              ? t.resendCooldown.replace("{seconds}", String(cooldown))
              : t.resend}
          </button>
          <Link
            to="/login"
            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            {t.backToLogin}
          </Link>
        </div>
      </form>
    </div>
  );
}
