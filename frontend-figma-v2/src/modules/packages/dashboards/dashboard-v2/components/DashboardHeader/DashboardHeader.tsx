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
    <header className="flex flex-col gap-3 pt-6 md:gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0 flex flex-wrap items-center gap-3 md:gap-4">
        <h1 className="text-xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">
          {t.title}
        </h1>
        {freshness && <FreshnessIndicator freshness={freshness} />}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <PeriodSelector value={selectedPeriod} onChange={onPeriodChange} />
        <ExportMenu />
      </div>
    </header>
  );
}
