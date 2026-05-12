import { useEffect, useRef, useState } from "react";
import { History } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import type { CreditPackage } from "@/api/types";
import { useCreditPackages } from "@/modules/packages/packages/hooks";

import { ActiveBagsList } from "../ActiveBagsList";
import { BuyCreditsCTA } from "../BuyCreditsCTA";
import { FifoExplainerCard } from "../FifoExplainerCard";
import { LowBalanceAlert } from "../LowBalanceAlert";
import { PackageCardsGrid } from "../PackageCardsGrid";
import { PurchaseDialog } from "../PurchaseDialog";
import { RecentPurchasesPreview } from "../RecentPurchasesPreview";
import { AppPageHeader } from "@/shared/components/layout/AppPageHeader";
import { WalletKpiGrid } from "../WalletKpiGrid";
import { DemoNoticeBanner } from "../shared/DemoNoticeBanner";
import { packagesStrings } from "@/modules/packages/packages/strings";
import { PackageComparisonTable } from "./PackageComparisonTable";

export function PackagesPage() {
  const [selected, setSelected] = useState<CreditPackage | null>(null);
  const [open, setOpen] = useState(false);
  const { data: packages } = useCreditPackages();
  const packagesGridRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleBuy = (pkg: CreditPackage) => {
    setSelected(pkg);
    setOpen(true);
  };

  const handleQuickBuy = () => {
    const recommended =
      packages?.find((p) => p.recommended) ?? packages?.[1] ?? packages?.[0];
    if (recommended) handleBuy(recommended);
  };

  const scrollToPackages = () => {
    packagesGridRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Honor inbound hash (e.g. /packages#packages from Dashboard).
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (!hash) return;
    // Defer one tick so sections have mounted.
    const t = window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
    return () => window.clearTimeout(t);
  }, [location.hash]);

  const hub = packagesStrings.walletHub;

  return (
    <>
      <div className="space-y-5">
        <AppPageHeader
          title={packagesStrings.walletHub.title}
          description={packagesStrings.walletHub.subtitle}
          primaryAction={{
            label: packagesStrings.page.historyCta,
            icon: <History className="h-4 w-4" aria-hidden="true" />,
            onClick: () => navigate("/packages/history"),
          }}
        />
        <DemoNoticeBanner
          tone="neutral"
          message={packagesStrings.demoNotice.pageBanner}
        />

        <div className="min-w-0 space-y-5">
            <section
              id="overview"
              aria-labelledby="overview-heading"
              className="scroll-mt-24 space-y-4"
            >
              <h2 id="overview-heading" className="sr-only">
                {hub.sectionOverview}
              </h2>
              <LowBalanceAlert onRecharge={scrollToPackages} />
              <WalletKpiGrid />
              <div className="grid gap-4 lg:grid-cols-2">
                <BuyCreditsCTA onRecharge={scrollToPackages} />
                <FifoExplainerCard />
              </div>
            </section>

            <div className="grid gap-5 lg:grid-cols-2 items-start">
              <section
                id="active-bags"
                aria-labelledby="active-bags-heading"
                className="scroll-mt-24 space-y-3"
              >
                <div className="space-y-1">
                  <h2
                    id="active-bags-heading"
                    className="text-xl font-semibold tracking-tight text-foreground"
                  >
                    {hub.sectionActiveBags}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {packagesStrings.activeBags.subtitle}
                  </p>
                </div>
                <ActiveBagsList />
              </section>

              <section
                id="purchases"
                aria-labelledby="purchases-heading"
                className="scroll-mt-24 space-y-3"
              >
                <h2 id="purchases-heading" className="sr-only">
                  {hub.sectionRecent}
                </h2>
                <RecentPurchasesPreview
                  onEmptyCta={handleQuickBuy}
                  onRetryPayment={handleBuy}
                />
              </section>
            </div>

            <section
              id="packages"
              aria-labelledby="more-packages-heading"
              className="scroll-mt-24 space-y-3"
              ref={packagesGridRef}
            >
              <div className="space-y-1">
                <h2
                  id="more-packages-heading"
                  className="text-xl font-semibold tracking-tight text-foreground"
                >
                  {hub.sectionMorePackages}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {hub.sectionMorePackagesSub}
                </p>
              </div>
              <PackageCardsGrid onBuy={handleBuy} />
              {packages ? <PackageComparisonTable packages={packages} /> : null}
            </section>
          </div>
      </div>
      <PurchaseDialog pkg={selected} open={open} onOpenChange={setOpen} />
    </>
  );
}
