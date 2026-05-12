import { AppPageHeader } from "@/shared/components/layout/AppPageHeader";
import { editorialStrings } from "../strings";
import { HeroBalanceBlock } from "../components/HeroBalanceBlock";
import { KpiRow } from "../components/KpiRow";
import { TopTracksCarousel } from "../components/TopTracksCarousel";
import { ConsumptionSection } from "../components/ConsumptionSection";
import { RecentPaymentsList } from "../components/RecentPaymentsList";
import { EditorialFooter } from "../components/EditorialFooter";

/**
 * Editorial dashboard exploration. Visual-only, hardcoded data.
 * Lives at /dashboard-editorial. Does not share code with /dashboard03 (V1).
 */
export function DashboardEditorialPage() {
  const t = editorialStrings.header;

  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 pb-10 md:px-10 md:pb-14">
      <div className="flex flex-col gap-12 md:gap-16">
        <AppPageHeader title={t.greeting} description={t.subtitle} />

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-pill border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
          >
            <span>{t.period}</span>
          </button>
          <button
            type="button"
            disabled
            className="rounded-pill border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted opacity-50 cursor-not-allowed"
          >
            {t.exportCta}
          </button>
        </div>
        <HeroBalanceBlock />
        <KpiRow />
        <TopTracksCarousel />
        <ConsumptionSection />
        <RecentPaymentsList />
        <EditorialFooter />
      </div>
    </div>
  );
}
