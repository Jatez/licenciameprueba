import { AlertOctagon, RotateCcw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { billingStrings } from "../strings";

interface Props {
  reason: string;
  onRetry: () => void;
  onMarkFailed: () => void;
}

const REASON_KEY_MAP: Record<string, keyof typeof billingStrings.detail.error> = {
  insufficient_funds: "insufficient_funds",
  bank_rejected: "bank_rejected",
  timeout_pse: "timeout_pse",
  gateway_error: "gateway_error",
};

export function PaymentErrorState({ reason, onRetry, onMarkFailed }: Props) {
  const t = billingStrings.detail;
  const key = REASON_KEY_MAP[reason] ?? "gateway_error";
  const message = t.error[key];

  return (
    <div className="space-y-3 rounded-lg border border-error/40 bg-error/10 p-4">
      <div className="flex gap-3">
        <AlertOctagon className="mt-0.5 h-4 w-4 shrink-0 text-error" aria-hidden="true" />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-error">{t.sections.error}</p>
          <p className="text-xs text-foreground/80">{message}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={onRetry}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          {t.actions.retry}
        </Button>
        <Button variant="ghost" size="sm" onClick={onMarkFailed}>
          <XCircle className="h-4 w-4" aria-hidden="true" />
          {t.actions.markFailed}
        </Button>
      </div>
    </div>
  );
}
