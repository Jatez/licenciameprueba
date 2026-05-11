import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWalletAggregate } from "@/modules/packages/packages/hooks";
import { packagesStrings, formatString } from "@/modules/packages/packages/strings";
import { formatCredits } from "@/modules/packages/packages/utils/formatCredits";
import { isBalanceLow } from "@/modules/packages/packages/utils/lowBalanceThreshold";

interface LowBalanceBannerProps {
  /** Where the CTA navigates. Default: full corporate wizard. */
  target?: "/packages" | "/wallet/checkout";
  /** Allow inline dismissal (used for non-critical surfaces like catalog). */
  dismissible?: boolean;
  className?: string;
  /**
   * Hand-off F-05: when the notifications module is wired, pass this callback
   * to mark the alert as read in the notification feed.
   */
  onDismiss?: () => void;
}

/**
 * Reusable low-balance card-style banner for surfaces outside the wallet hub
 * (dashboard, catalog, etc.). For the in-page alert variant inside /packages
 * use `LowBalanceAlert` instead.
 */
export function LowBalanceBanner({
  target = "/wallet/checkout",
  dismissible = false,
  className,
  onDismiss,
}: LowBalanceBannerProps) {
  const s = packagesStrings.lowBalanceBanner;
  const { data } = useWalletAggregate();
  const [dismissed, setDismissed] = useState(false);

  if (!data || !isBalanceLow(data.balance) || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <Card
      role="status"
      className={`border-warning/40 bg-warning-subtle/40 ${className ?? ""}`}
    >
      <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <AlertTriangle
            className="mt-0.5 h-5 w-5 shrink-0 text-[#92400E]"
            aria-hidden="true"
          />
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-[#92400E]">{s.title}</p>
            <p className="text-sm text-[#92400E]">
              {formatString(s.body, { count: formatCredits(data.balance) })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end md:self-auto">
          <Button asChild size="sm">
            <Link to={target}>{s.cta}</Link>
          </Button>
          {dismissible ? (
            <button
              type="button"
              onClick={handleDismiss}
              aria-label={s.dismissAria}
              className="rounded-full p-2 text-[#92400E] hover:bg-warning-subtle"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
