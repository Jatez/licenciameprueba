import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useResendVerification } from "../../../hooks/useResendVerification";
import { useAuthErrorMessage } from "../../../hooks/useAuthErrorMessage";
import { authStrings } from "../../../strings";

export function VerifyEmailExpired() {
  const t = authStrings.verifyEmail.expired;
  const email = useAuthStore((s) => s.pendingVerificationEmail);
  const { resendAsync, isResending, canResend, cooldownSeconds } = useResendVerification();
  const toMessage = useAuthErrorMessage();

  const handleResend = async () => {
    if (!email) {
      toast.error(authStrings.verifyEmail.errorGeneric.description);
      return;
    }
    try {
      await resendAsync({ email });
      toast.success(authStrings.verifyEmail.waiting.resentToast);
    } catch (error) {
      toast.error(toMessage(error).message);
    }
  };

  const label = !canResend && cooldownSeconds > 0
    ? authStrings.verifyEmail.waiting.resendCooldown.replace("{seconds}", String(cooldownSeconds))
    : t.cta;

  return (
    <div className="space-y-5 text-center">
      <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" aria-hidden="true" />
      <div className="space-y-1.5">
        <h1 className="text-xl font-semibold tracking-tight">{t.title}</h1>
        <p className="text-sm text-muted-foreground">{t.description}</p>
      </div>
      <Button onClick={handleResend} disabled={!canResend} className="w-full">
        {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
        {label}
      </Button>
    </div>
  );
}
