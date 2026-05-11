import { useEffect, useRef } from "react";
import { AlertOctagon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { licensingStrings, formatString } from "@/modules/packages/licensing/strings";
import type { LicensingErrorCode } from "@/api/types";

export type SubmitErrorAction = "retry" | "back" | "buy" | "refresh-terms" | "support" | "cancel";

interface Props {
  code: LicensingErrorCode;
  context: { balance?: number; required?: number; reference?: string };
  onAction: (action: SubmitErrorAction) => void;
}

const PRIMARY_ACTION: Record<LicensingErrorCode, SubmitErrorAction> = {
  INSUFFICIENT_CREDITS: "buy",
  WALLET_EXPIRED_DURING_TRANSACTION: "buy",
  TERMS_VERSION_OUTDATED: "refresh-terms",
  CONCURRENT_LICENSING_DETECTED: "retry",
  NETWORK_ERROR: "retry",
  UNEXPECTED_ERROR: "support",
  TRACK_NOT_LICENSABLE_FOR_USAGE: "back",
  TRACK_REMOVED: "back",
};

const SECONDARY_ACTION: Record<LicensingErrorCode, SubmitErrorAction> = {
  INSUFFICIENT_CREDITS: "back",
  WALLET_EXPIRED_DURING_TRANSACTION: "cancel",
  TERMS_VERSION_OUTDATED: "cancel",
  CONCURRENT_LICENSING_DETECTED: "cancel",
  NETWORK_ERROR: "cancel",
  UNEXPECTED_ERROR: "cancel",
  TRACK_NOT_LICENSABLE_FOR_USAGE: "cancel",
  TRACK_REMOVED: "cancel",
};

export function SubmitErrorBanner({ code, context, onAction }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, [code]);

  const errorsMap = licensingStrings.step3.errors as Record<
    string,
    { title: string; message: string; primaryCta: string; secondaryCta: string }
  >;
  const fallback = errorsMap.UNEXPECTED_ERROR;
  const errorStrings = errorsMap[code] ?? fallback;
  const message = formatString(errorStrings.message, {
    balance: context.balance ?? 0,
    required: context.required ?? 0,
    reference: context.reference ?? "—",
  });

  return (
    <div ref={ref} tabIndex={-1} className="outline-none">
      <Alert role="alert" variant="destructive" className="border-destructive/40">
        <AlertOctagon className="h-4 w-4" />
        <AlertTitle>{errorStrings.title}</AlertTitle>
        <AlertDescription className="space-y-3">
          <p>{message}</p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => onAction(PRIMARY_ACTION[code])}>
              {errorStrings.primaryCta}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAction(SECONDARY_ACTION[code])}
            >
              {errorStrings.secondaryCta}
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
