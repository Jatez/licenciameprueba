import { KPICard } from "@/components/ui/kpi-card";
import type { DashboardKpi, KpiId, WalletV2 } from "@/api/types.dashboard";
import { KpiCard } from "./KpiCard";

interface KpiRowProps {
  kpis: DashboardKpi[];
  wallet?: WalletV2;
  isLoading?: boolean;
}

const ctaRouteByKpi: Record<KpiId, string> = {
  balance: "/packages",
  "active-licenses": "/licenses",
  "tracked-posts": "/metricas",
  "bag-validity": "/packages",
};

export function KpiRow({ kpis, wallet, isLoading }: KpiRowProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <KPICard key={i} label="" value="" isLoading />
        ))}
      </div>
    );
  }

  const isLowBalance = !!wallet && wallet.balance < wallet.lowBalanceThreshold;
  const isBagExpiringSoon =
    !!wallet &&
    wallet.daysUntilExpiry != null &&
    wallet.daysUntilExpiry < wallet.expiryWarningDays;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <KpiCard
          key={kpi.id}
          kpi={kpi}
          wallet={wallet}
          ctaRoute={ctaRouteByKpi[kpi.id]}
          isLowBalance={isLowBalance}
          isBagExpiringSoon={isBagExpiringSoon}
        />
      ))}
    </div>
  );
}
