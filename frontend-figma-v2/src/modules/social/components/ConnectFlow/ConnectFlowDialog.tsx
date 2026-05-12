import { useEffect, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  useConnectSocialAccount,
  useReconnectSocialAccount,
} from "@/modules/social/hooks";
import { useSocialDebugStore } from "@/modules/social/stores/socialDebugStore";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";
import { socialStrings } from "@/modules/social/strings";
import { ConnectFlowError } from "@/api/types";
import { socialApi } from "@/api/endpoints/social";
import { ConsentStep } from "./parts/ConsentStep";
import { OAuthSimulatorStep } from "./parts/OAuthSimulatorStep";
import { SuccessStep } from "./parts/SuccessStep";
import { PermissionsDeniedStep } from "./parts/PermissionsDeniedStep";
import { PopupBlockedStep } from "./parts/PopupBlockedStep";
import { AccountTakenStep } from "./parts/AccountTakenStep";
import { ReconnectIntroStep } from "./parts/ReconnectIntroStep";
import { generateMockConnection } from "./ConnectFlow.utils";
import type {
  ConnectFlowDialogProps,
  FlowStep,
  MockConnectionResult,
} from "./ConnectFlow.types";

function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

export function ConnectFlowDialog({
  platform,
  onClose,
  mode = "connect",
  existingAccount = null,
}: ConnectFlowDialogProps) {
  const open = platform !== null;
  const [step, setStep] = useState<FlowStep>(
    mode === "reconnect" ? "reconnect-intro" : "consent",
  );
  const [result, setResult] = useState<MockConnectionResult | null>(null);
  const [attemptedUsername, setAttemptedUsername] = useState<string>("");
  const connectMutation = useConnectSocialAccount();
  const reconnectMutation = useReconnectSocialAccount();
  const { popupBlocked, accountTaken } = useSocialDebugStore();
  const lastPlatformRef = useRef<typeof platform>(null);

  // Reset machine each time the dialog opens for a (new) platform.
  useEffect(() => {
    if (platform && platform !== lastPlatformRef.current) {
      lastPlatformRef.current = platform;
      setStep(mode === "reconnect" ? "reconnect-intro" : "consent");
      setResult(null);
      setAttemptedUsername("");
    }
    if (!platform) {
      lastPlatformRef.current = null;
    }
  }, [platform, mode]);

  if (!platform) return null;

  const lockClose = step === "success-syncing" || step === "success-done";
  const platformLabel = trackingStrings.syncStatus.platformLabels[platform];

  const handleOpenChange = (next: boolean) => {
    if (!next && !lockClose) {
      onClose();
    }
  };

  const handleContinueFromConsent = async () => {
    if (popupBlocked) {
      setStep("popup-blocked");
      return;
    }
    if (!platform) return;

    // OAuth real es la única vía. Si falla, mostramos error claro.
    try {
      const oauthUrl = await socialApi.getOAuthUrl(platform);
      if (!oauthUrl) {
        toast.error(`OAuth de ${platform} no está configurado en el servidor. Avisa al administrador.`);
        return;
      }
      window.location.href = oauthUrl;
    } catch (err) {
      toast.error(`No pudimos iniciar el flujo OAuth de ${platform}. Intenta de nuevo.`);
    }
  };

  const handleAuthorize = () => {
    setStep("oauth-loading");
  };

  const runConnect = async () => {
    try {
      if (mode === "reconnect" && existingAccount) {
        await reconnectMutation.mutateAsync({
          accountId: existingAccount.id,
          options: { simulateAccountTaken: accountTaken },
        });
      } else {
        await connectMutation.mutateAsync({
          platform,
          options: { simulateAccountTaken: accountTaken },
        });
      }
      const generated = generateMockConnection(platform);
      setResult(generated);
      setStep("success-syncing");
    } catch (err) {
      if (err instanceof ConnectFlowError && err.code === "account_taken") {
        setAttemptedUsername(err.attemptedUsername ?? "@usuario_demo");
        setStep("account-taken");
        return;
      }
      // Unexpected: bail back to consent, surface a toast.
      toast.error("No pudimos completar la conexión. Intenta de nuevo.");
      setStep(mode === "reconnect" ? "reconnect-intro" : "consent");
    }
  };

  const handleLoadingComplete = () => {
    void runConnect();
  };

  const handleDone = () => {
    setStep("success-done");
    if (mode === "reconnect") {
      toast.success(
        interpolate(socialStrings.connectFlow.reconnect.toastSuccess, {
          platform: platformLabel,
        }),
      );
    }
    onClose();
  };

  // Width depends on the step: simulator wants a tighter popup feel.
  const isOauth = step === "oauth" || step === "oauth-loading";
  const widthClass = isOauth ? "sm:max-w-md" : "sm:max-w-lg";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          onEscapeKeyDown={(e) => {
            if (lockClose) e.preventDefault();
          }}
          onPointerDownOutside={(e) => {
            if (lockClose) e.preventDefault();
          }}
          onInteractOutside={(e) => {
            if (lockClose) e.preventDefault();
          }}
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
            widthClass,
          )}
        >
          {!lockClose && (
            <DialogPrimitive.Close
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </DialogPrimitive.Close>
          )}

          {step === "consent" && (
            <ConsentStep
              platform={platform}
              onCancel={onClose}
              onContinue={handleContinueFromConsent}
            />
          )}

          {step === "reconnect-intro" && existingAccount && (
            <ReconnectIntroStep
              account={existingAccount}
              onCancel={onClose}
              onContinue={handleContinueFromConsent}
            />
          )}

          {(step === "oauth" || step === "oauth-loading") && (
            <OAuthSimulatorStep
              platform={platform}
              isLoading={step === "oauth-loading"}
              onDeny={() => setStep("permissions-denied")}
              onAuthorize={handleAuthorize}
              onLoadingComplete={handleLoadingComplete}
            />
          )}

          {step === "permissions-denied" && (
            <PermissionsDeniedStep
              platform={platform}
              onRetry={() =>
                setStep(mode === "reconnect" ? "reconnect-intro" : "consent")
              }
              onDismiss={onClose}
            />
          )}

          {step === "popup-blocked" && (
            <PopupBlockedStep
              onRetry={() =>
                setStep(mode === "reconnect" ? "reconnect-intro" : "consent")
              }
              onClose={onClose}
            />
          )}

          {step === "account-taken" && (
            <AccountTakenStep
              attemptedUsername={attemptedUsername}
              onClose={onClose}
            />
          )}

          {(step === "success-syncing" || step === "success-done") && result && (
            <SuccessStep platform={platform} result={result} onDone={handleDone} />
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
