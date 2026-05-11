import { Link } from "react-router-dom";
import { Coins, Hourglass } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMySubscription } from "@/modules/packages/packages/hooks";
import { packagesStrings, formatString } from "@/modules/packages/packages/strings";
import { formatCredits } from "@/modules/packages/packages/utils/formatCredits";

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function WalletSummaryStrip() {
  const s = packagesStrings.walletSummary;
  const { data: sub, isLoading, error, refetch } = useMySubscription();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-9 w-40" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription className="flex items-center justify-between gap-3">
          <span>{s.loadingError}</span>
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            {s.retry}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!sub) {
    return (
      <Card>
        <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">{s.noActiveBags}</p>
          <Button asChild variant="outline">
            <Link to="/wallet/checkout">{packagesStrings.walletHub.ctaBuyCredits}</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const daysLeft = Math.ceil(
    (new Date(sub.current_period_ends_at).getTime() - Date.now()) / 86_400_000,
  );

  return (
    <Card className="border-metric/40 bg-metric-subtle/40">
      <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-2xl font-semibold text-foreground">
            <Coins className="h-5 w-5" aria-hidden="true" />
            <span>
              {formatString(s.creditsAvailable, {
                count: formatCredits(sub.credits_available),
              })}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Plan <strong>{sub.package_name}</strong> · {sub.credits_total} créditos totales
          </p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Hourglass className="h-3.5 w-3.5" aria-hidden="true" />
            Vence el {fmtDate(sub.current_period_ends_at)}{" "}
            {daysLeft > 0 ? `(${daysLeft} días)` : "(vencido)"}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/packages/history">{packagesStrings.page.historyCta}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
