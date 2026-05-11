import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { CreditPackage } from "@/api/types";
import { useCreditPackages } from "@/modules/packages/packages/hooks";
import { PackageCard } from "./PackageCard";

interface PackageCardsGridProps {
  onBuy: (pkg: CreditPackage) => void;
}

export function PackageCardsGrid({ onBuy }: PackageCardsGridProps) {
  const { data, isLoading, error, refetch } = useCreditPackages();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-72 w-full" />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <Alert variant="destructive">
        <AlertDescription className="flex items-center justify-between gap-3">
          <span>No pudimos cargar los paquetes.</span>
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            Reintentar
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Best price-per-credit (excluding the explicitly "recommended" one).
  const bestRatio = data.length > 0
    ? data.reduce((best, p) =>
        p.pricePerCreditCop < best.pricePerCreditCop ? p : best,
      )
    : null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.map((pkg) => (
        <PackageCard
          key={pkg.id}
          pkg={pkg}
          onBuy={onBuy}
          isBestRatio={bestRatio !== null && pkg.id === bestRatio.id && !pkg.recommended}
        />
      ))}
    </div>
  );
}

export { PackageCard };
