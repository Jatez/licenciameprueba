import { Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useResendVerification } from "../../../hooks/useResendVerification";
import { useAuthErrorMessage } from "../../../hooks/useAuthErrorMessage";
import { authStrings } from "../../../strings";
import { VerifyEmailDevHelpers } from "./VerifyEmailDevHelpers";

interface Props {
  email: string | null;
}

export function VerifyEmailWaiting({ email }: Props) {
  const t = authStrings.verifyEmail.waiting;
  const { resendAsync, isResending, canResend, cooldownSeconds } = useResendVerification();
  const toMessage = useAuthErrorMessage();

  const description = email
    ? t.description.replace("{email}", email)
    : t.descriptionFallback;

  const handleResend = async () => {
    if (!email) {
      toast.error(authStrings.verifyEmail.errorGeneric.description);
      return;
    }
    try {
      await resendAsync({ email });
      toast.success(t.resentToast);
    } catch (error) {
      toast.error(toMessage(error).message);
    }
  };

  const buttonLabel = isResending
    ? t.resending
    : !canResend && cooldownSeconds > 0
      ? t.resendCooldown.replace("{seconds}", String(cooldownSeconds))
      : t.resend;

  return (
    <div className="space-y-5 text-center">
      <Mail className="mx-auto h-12 w-12 text-muted-foreground" aria-hidden="true" />
      <div className="space-y-1.5">
        <h1 className="text-xl font-semibold tracking-tight">{t.title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <p className="text-xs text-muted-foreground">{t.notReceived}</p>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleResend}
        disabled={!canResend || isResending}
      >
        {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
        {buttonLabel}
      </Button>
      <VerifyEmailDevHelpers />
    </div>
  );
}
