/**
 * F-11 · 4 KPI cards: Publications, Views, Interactions, Engagement rate.
 *
 * Reuses the design-system <KPICard>. When delta is null → omit chip.
 * When delta % is exactly 0 → omit chip + render small "Sin cambio" label.
 * Engagement delta is rendered in percentage points (pp), still using KPIDelta.
 */
import { KPICard, type KPIDelta, type KPIDeltaSentiment } from "@/components/ui/kpi-card";
import {
  formatCompactNumber,
  formatPercent,
  useFormatCredits,
} from "@/shared/format";
import type { MetricsOverview } from "../types";
import { metricsStrings } from "../strings";

interface KpiGridProps {
  overview: MetricsOverview | null;
  isLoading: boolean;
  /** When sync mode is partial, show the asterisk on Views KPI. */
  partialNote?: { synced: number; total: number } | null;
}

function pickSentiment(value: number | null): KPIDeltaSentiment {
  if (value === null || value === 0) return "neutral";
  return value > 0 ? "positive" : "negative";
}

function buildDelta(percent: number | null): KPIDelta | undefined {
  if (percent === null || percent === 0) return undefined;
  return {
    value: 0,
    percent: Math.round(percent),
    period: metricsStrings.kpis.deltaPeriodLabel,
    sentiment: pickSentiment(percent),
  };
}

export function KpiGrid({ overview, isLoading, partialNote }: KpiGridProps) {
  const formatInt = useFormatCredits();
  const t = metricsStrings.kpis;

  if (isLoading || !overview) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <KPICard key={i} label="" value="" isLoading />
        ))}
      </div>
    );
  }

  const { totals, deltas } = overview;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <KpiSlot
        label={t.publications.label}
        value={formatInt(totals.publications)}
        deltaPercent={deltas.publications}
        ariaLabel={t.publications.tooltip}
      />
      <KpiSlot
        label={t.views.label}
        value={formatCompactNumber(totals.views)}
        deltaPercent={deltas.views}
        ariaLabel={t.views.tooltip}
        suffixHint={
          partialNote
            ? { synced: partialNote.synced, total: partialNote.total }
            : null
        }
      />
      <KpiSlot
        label={t.interactions.label}
        value={formatCompactNumber(totals.interactions)}
        deltaPercent={deltas.interactions}
        ariaLabel={t.interactions.tooltip}
      />
      <KpiSlot
        label={t.engagement.label}
        value={`${formatPercent(totals.engagementRate, { decimals: 1 }).replace(" %", "")}%`}
        deltaPercent={deltas.engagementRate}
        ariaLabel={t.engagement.tooltip}
      />
    </div>
  );
}

interface KpiSlotProps {
  label: string;
  value: string;
  unit?: string;
  deltaPercent: number | null;
  ariaLabel: string;
  suffixHint?: { synced: number; total: number } | null;
}

function KpiSlot({
  label,
  value,
  unit,
  deltaPercent,
  ariaLabel,
  suffixHint,
}: KpiSlotProps) {
  const showNoChange = deltaPercent === 0;
  const labelWithAsterisk = suffixHint ? `${label} *` : label;

  return (
    <div className="relative">
      <KPICard
        label={labelWithAsterisk}
        value={value}
        unit={unit}
        delta={buildDelta(deltaPercent)}
        ariaLabel={ariaLabel}
      />
      {showNoChange && (
        <span className="pointer-events-none absolute right-4 top-12 text-xs text-foreground/50">
          {metricsStrings.kpis.noChange}
        </span>
      )}
      {suffixHint && (
        <p className="mt-1 px-1 text-[11px] text-foreground/55">
          * {`${suffixHint.synced} de ${suffixHint.total} con datos confirmados`}
        </p>
      )}
    </div>
  );
}
