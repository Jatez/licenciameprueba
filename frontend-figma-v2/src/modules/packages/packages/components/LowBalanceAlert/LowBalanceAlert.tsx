import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useWalletAggregate } from "@/modules/packages/packages/hooks";
import { packagesStrings, formatString } from "@/modules/packages/packages/strings";
import { formatCredits } from "@/modules/packages/packages/utils/formatCredits";
import { isBalanceLow } from "@/modules/packages/packages/utils/lowBalanceThreshold";

interface LowBalanceAlertProps {
  /** Smooth-scrolls to the `#packages` section. */
  onRecharge: () => void;
}

/**
 * Renders a warning when the company balance falls under
 * `LOW_BALANCE_THRESHOLD`. Hidden otherwise.
 */
export function LowBalanceAlert({ onRecharge }: LowBalanceAlertProps) {
  const s = packagesStrings.walletHub.lowBalance;
  const { data } = useWalletAggregate();

  if (!data || !isBalanceLow(data.balance)) return null;

  return (
    <Alert
      role="alert"
      className="border-warning/40 bg-warning-subtle text-[#92400E]"
    >
      <AlertTriangle className="h-4 w-4 text-[#92400E]" aria-hidden="true" />
      <AlertTitle className="text-[#92400E]">{s.title}</AlertTitle>
      <AlertDescription className="flex flex-col gap-3 text-[#92400E] md:flex-row md:items-center md:justify-between">
        <span>
          {formatString(s.body, { count: formatCredits(data.balance) })}
        </span>
        <Button size="sm" onClick={onRecharge} className="shrink-0">
          {s.cta}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
