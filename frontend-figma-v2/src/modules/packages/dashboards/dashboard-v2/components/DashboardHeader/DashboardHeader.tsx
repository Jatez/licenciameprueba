import type { DashboardFreshness, DashboardPeriod } from "@/api/types.dashboard";
import { dashboardV2Strings } from "../../strings";
import { PeriodSelector } from "./PeriodSelector";
import { ExportMenu } from "./ExportMenu";
import { FreshnessIndicator } from "./FreshnessIndicator";

interface DashboardHeaderProps {
  selectedPeriod: DashboardPeriod;
  onPeriodChange: (p: DashboardPeriod) => void;
  freshness?: DashboardFreshness;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function DashboardHeader({
  selectedPeriod,
  onPeriodChange,
  freshness,
}: DashboardHeaderProps) {
  const t = dashboardV2Strings.header;

  return (
    <header className="flex flex-col gap-2 md:gap-3 lg:flex-row lg:items-center lg:justify-between pt-mobile-stack-lg">
      <div className="flex flex-wrap items-center gap-2 md:gap-3 min-w-0">
        <h1 className="text-xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">
          {t.title}
        </h1>
        {freshness && <FreshnessIndicator freshness={freshness} />}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <PeriodSelector value={selectedPeriod} onChange={onPeriodChange} />
        <ExportMenu />
      </div>
    </header>
  );
}
