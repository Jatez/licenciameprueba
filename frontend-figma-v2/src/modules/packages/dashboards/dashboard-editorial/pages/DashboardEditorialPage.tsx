import { EditorialPageHeader } from "../components/EditorialPageHeader";
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
  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-10 md:px-10 md:py-14">
      <div className="flex flex-col gap-12 md:gap-16">
        <div className="md:hidden -mt-6">
          <AppPageHeader
            title={editorialStrings.header.greeting}
            description={editorialStrings.header.subtitle}
          />
        </div>
        <div className="hidden md:block">
          <EditorialPageHeader />
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
