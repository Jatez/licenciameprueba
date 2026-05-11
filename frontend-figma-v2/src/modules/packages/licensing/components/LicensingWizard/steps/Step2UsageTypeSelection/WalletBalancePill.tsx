import { Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { licensingStrings, formatString } from "@/modules/packages/licensing/strings";

interface Props {
  balance: number;
  daysUntilExpiry: number | null;
  isLoading: boolean;
  isInsufficient: boolean;
  onBuyCredits: () => void;
}

function formatDuration(days: number | null): string | null {
  if (days === null) return null;
  if (days >= 60) {
    const months = Math.round(days / 30);
    return `${months} mes${months === 1 ? "" : "es"}`;
  }
  return `${days} día${days === 1 ? "" : "s"}`;
}

/**
 * Sticky pill announcing the current credit balance. `aria-live="polite"` so
 * screen readers pick up changes after credits are spent.
 */
export function WalletBalancePill({
  balance,
  daysUntilExpiry,
  isLoading,
  isInsufficient,
  onBuyCredits,
}: Props) {
  if (isLoading) {
    return <Skeleton className="h-10 w-64 rounded-full" />;
  }

  const expiry = formatDuration(daysUntilExpiry);

  return (
    <div
      aria-live="polite"
      aria-label={licensingStrings.wallet.aria}
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-full border px-4 py-2 text-sm tabular-nums",
        isInsufficient
          ? "border-destructive/40 bg-destructive/10 text-destructive"
          : "border-border bg-muted/40 text-foreground",
      )}
    >
      <div className="flex items-center gap-2">
        <Wallet className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
        <span className="font-medium">
          {isInsufficient
            ? licensingStrings.wallet.insufficient
            : formatString(licensingStrings.wallet.currentBalance, { balance })}
        </span>
        {!isInsufficient && expiry && (
          <span className="text-xs text-muted-foreground">
            · {formatString(licensingStrings.wallet.expiresIn, { duration: expiry })}
          </span>
        )}
      </div>
      {isInsufficient && (
        <Button size="sm" variant="outline" onClick={onBuyCredits}>
          {licensingStrings.wallet.buyCredits}
        </Button>
      )}
    </div>
  );
}
