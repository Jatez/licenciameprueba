import { useNavigate } from "react-router-dom";
import { KPICard, type KPIFillPattern } from "@/components/ui/kpi-card";
import type { DashboardKpi, KpiId, WalletV2 } from "@/api/types.dashboard";
import { dashboardV2Strings } from "../../strings";
import { useFormatCompactNumber } from "../../hooks";

interface KpiCardProps {
  kpi: DashboardKpi;
  ctaRoute: string;
  wallet?: WalletV2;
  isLowBalance?: boolean;
  isBagExpiringSoon?: boolean;
}

const TOTAL_BAG_DAYS = 365;

/**
 * Texture per KPI to differentiate cards while keeping a unified black stroke.
 * `bag-validity` is countdown (no sparkline) → value is unused.
 */
const fillPatternByKpi: Record<KpiId, KPIFillPattern> = {
  balance: "gradient",
  "active-licenses": "stripes",
  "tracked-posts": "gradient",
  "bag-validity": "gradient",
};

/**
 * Adapter that maps the DashboardKpi backend contract to the generic <KPICard>
 * design-system primitive. Picks variant + computes countdown for `bag-validity`.
 */
export function KpiCard({ kpi, ctaRoute, wallet, isLowBalance, isBagExpiringSoon }: KpiCardProps) {
  const navigate = useNavigate();
  const formatCompact = useFormatCompactNumber();
  const meta = dashboardV2Strings.kpis[kpi.id];

  const isCountdown = kpi.id === "bag-validity";
  const displayValue =
    typeof kpi.value === "number" ? formatCompact(kpi.value) : kpi.value;

  // Stroke is unified to foreground (black). KPICard auto-inverts to background
  // when appearance="dark" so the line stays visible.
  // Override only for semantic alert on countdown.
  const sparklineColor =
    isCountdown && isBagExpiringSoon
      ? "hsl(var(--color-warning-subtle))"
      : "hsl(var(--foreground))";

  const isHighlighted =
    (kpi.id === "balance" && isLowBalance) ||
    (isCountdown && isBagExpiringSoon);

  const appearance = "light";

  return (
    <KPICard
      label={meta.label}
      value={isCountdown && wallet?.daysUntilExpiry != null ? wallet.daysUntilExpiry : displayValue}
      unit={meta.unit}
      delta={
        kpi.deltaValue || kpi.deltaPercent
          ? {
              value: kpi.deltaValue,
              percent:
                kpi.direction === "down"
                  ? -Math.abs(kpi.deltaPercent)
                  : Math.abs(kpi.deltaPercent),
              period: "vs período anterior",
              sentiment: kpi.sentiment,
            }
          : undefined
      }
      trend={isCountdown ? undefined : kpi.sparkline}
      variant={isCountdown ? "countdown" : "metric"}
      countdown={
        isCountdown && wallet?.daysUntilExpiry != null
          ? { daysLeft: wallet.daysUntilExpiry, totalDays: TOTAL_BAG_DAYS }
          : undefined
      }
      ctaLabel={meta.cta}
      onCtaClick={() => navigate(ctaRoute)}
      isHighlighted={isHighlighted}
      sparklineColor={sparklineColor}
      fillPattern={fillPatternByKpi[kpi.id]}
      appearance={appearance}
    />
  );
}
