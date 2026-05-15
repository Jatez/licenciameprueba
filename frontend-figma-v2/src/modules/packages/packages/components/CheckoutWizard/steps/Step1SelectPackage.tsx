import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import type { CreditPackage, CreditPackageId, WalletAggregate } from "@/api/types";
import {
  useCreditPackages,
  useWalletAggregate,
} from "@/modules/packages/packages/hooks";
import { packagesStrings, formatString } from "@/modules/packages/packages/strings";
import { PackageCard } from "../../PackageCardsGrid";

interface Step1Props {
  selectedId: CreditPackageId | null;
  onSelect: (pkg: CreditPackage) => void;
}

export function Step1SelectPackage({ selectedId, onSelect }: Step1Props) {
  const s = packagesStrings.checkout.step1Body;
  const packages = useCreditPackages();
  const wallet = useWalletAggregate();

  return (
    <section aria-labelledby="step1-heading" className="space-y-4">
      <div className="space-y-1">
        <h2
          id="step1-heading"
          className="text-lg font-semibold text-foreground"
        >
          {s.title}
        </h2>
        <p className="text-sm text-muted-foreground">{s.subtitle}</p>
      </div>

      {packages.isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
         {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-72 w-full" />
          ))}
        </div>
      ) : packages.error || !packages.data ? (
        <Alert variant="destructive">
          <AlertDescription>{s.error}</AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {packages.data.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              onBuy={onSelect}
              isBestRatio={false}
              selectable
              selected={selectedId === pkg.id}
              ctaLabel={
                selectedId === pkg.id ? s.selectedCta : s.selectCta
              }
            />
          ))}
        </div>
      )}

      <ActiveBagsBanner wallet={wallet.data ?? null} />
    </section>
  );
}

function ActiveBagsBanner({ wallet }: { wallet: WalletAggregate | null }) {
  const s = packagesStrings.checkout.step1Body;
  const count = wallet?.bags.filter((b) => b.status === "active").length ?? 0;
  if (count === 0) return null;

  return (
    <Alert role="status" className="border-info/30 bg-info-subtle">
      <Info className="h-4 w-4" aria-hidden="true" />
      <AlertDescription className="text-sm">
        {formatString(s.accumulationBanner, { count })}
      </AlertDescription>
    </Alert>
  );
}
