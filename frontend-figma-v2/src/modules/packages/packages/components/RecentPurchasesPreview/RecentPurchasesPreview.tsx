import { useState } from "react";
import { Link } from "react-router-dom";
import { History } from "lucide-react";
import type { CreditPackage, Purchase } from "@/api/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useListPurchases } from "@/modules/packages/packages/hooks";
import { packagesStrings } from "@/modules/packages/packages/strings";
import { PurchaseDetailDrawer } from "../PurchaseDetailDrawer";
import { RecentPurchaseRow } from "./RecentPurchaseRow";

interface RecentPurchasesPreviewProps {
  onEmptyCta: () => void;
  /** Re-open the purchase dialog with a given package (for "Reintentar pago"). */
  onRetryPayment?: (pkg: CreditPackage) => void;
}

export function RecentPurchasesPreview({
  onEmptyCta,
  onRetryPayment,
}: RecentPurchasesPreviewProps) {
  const s = packagesStrings.walletHub.recent;
  const { data, isLoading, error, refetch } = useListPurchases({
    page: 1,
    pageSize: 10,
  });

  const [selected, setSelected] = useState<Purchase | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSelect = (purchase: Purchase) => {
    setSelected(purchase);
    setDrawerOpen(true);
  };

  const handleRetry = (purchase: Purchase) => {
    setDrawerOpen(false);
    onRetryPayment?.(purchase.packageSnapshot);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
          <div className="space-y-1">
            <CardTitle className="text-lg">{s.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{s.subtitle}</p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/packages/history">
              <History className="mr-1.5 h-4 w-4" aria-hidden="true" />
              {s.viewAll}
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {isLoading ? (
            <>
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription className="flex items-center justify-between gap-3">
                <span>{s.error}</span>
                <Button size="sm" variant="outline" onClick={() => refetch()}>
                  {s.retry}
                </Button>
              </AlertDescription>
            </Alert>
          ) : !data || data.purchases.length === 0 ? (
            <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-border bg-muted/40 p-6 text-center md:items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  {s.emptyTitle}
                </p>
                <p className="text-xs text-muted-foreground">
                  {s.emptyDescription}
                </p>
              </div>
              <Button size="sm" onClick={onEmptyCta}>
                {s.emptyCta}
              </Button>
            </div>
          ) : (
            data.purchases
              .slice(0, 3)
              .map((p) => (
                <RecentPurchaseRow
                  key={p.id}
                  purchase={p}
                  onSelect={handleSelect}
                />
              ))
          )}
        </CardContent>
      </Card>

      <PurchaseDetailDrawer
        purchase={selected}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onRetryPayment={onRetryPayment ? handleRetry : undefined}
      />
    </>
  );
}
