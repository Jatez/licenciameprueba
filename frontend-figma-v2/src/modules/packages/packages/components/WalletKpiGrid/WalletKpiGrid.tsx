import { Coins, Hourglass, ShoppingBag, TrendingDown } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWalletKpis } from "@/modules/packages/packages/hooks/useWalletKpis";
import { packagesStrings, formatString } from "@/modules/packages/packages/strings";
import { formatCredits } from "@/modules/packages/packages/utils/formatCredits";
import { WalletKpiCard } from "./WalletKpiCard";

export function WalletKpiGrid() {
  const s = packagesStrings.walletHub.kpis;
  const { kpis, isLoading, error, refetch } = useWalletKpis();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (error || !kpis) {
    return (
      <Alert variant="destructive">
        <AlertDescription className="flex items-center justify-between gap-3">
          <span>{s.error}</span>
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            {s.retry}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const activeBagsLabel =
    kpis.activeBagsCount === 1
      ? formatString(s.activeBags, { count: kpis.activeBagsCount })
      : formatString(s.activeBagsPlural, { count: kpis.activeBagsCount });

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <WalletKpiCard
        id="kpi-balance"
        icon={Coins}
        label={s.balance}
        value={formatCredits(kpis.balance)}
        unit={s.balanceUnit}
        hint={activeBagsLabel}
      />
      <WalletKpiCard
        id="kpi-consumed"
        icon={TrendingDown}
        label={s.consumed}
        value={formatCredits(kpis.consumed)}
        unit={s.balanceUnit}
        hint={s.consumedHint}
      />
      <WalletKpiCard
        id="kpi-purchased"
        icon={ShoppingBag}
        label={s.purchased}
        value={formatCredits(kpis.totalPurchased)}
        unit={s.balanceUnit}
        hint={s.purchasedHint}
      />
      <WalletKpiCard
        id="kpi-expiry"
        icon={Hourglass}
        label={s.nextExpiry}
        value={
          kpis.monthsUntilEarliestExpiry != null
            ? String(kpis.monthsUntilEarliestExpiry)
            : "—"
        }
        unit={kpis.monthsUntilEarliestExpiry != null ? s.nextExpiryUnit : undefined}
        hint={
          kpis.monthsUntilEarliestExpiry == null ? s.nextExpiryNone : undefined
        }
      />
    </div>
  );
}
