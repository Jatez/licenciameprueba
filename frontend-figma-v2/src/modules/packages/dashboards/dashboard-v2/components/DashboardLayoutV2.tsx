import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FrostedHeader } from "@/shared/components/ds/FrostedHeader";
import { useHeadroom } from "@/shared/hooks";
import { dashboardV2Strings } from "../strings";
import { useDashboardData, useDashboardPeriod, useActiveAlerts } from "../hooks";
import { useCurrentUser } from "@/modules/packages/onboarding/hooks";
import { DashboardHeader } from "./DashboardHeader";
import { AlertsSection } from "./AlertsSection";
import { KpiRow } from "./KpiRow";
import { CreditUsageChart } from "./CreditUsageChart";
import { WalletSection } from "./WalletSection";
import { TopTracks } from "./TopTracks";
import { PlatformBreakdown } from "./PlatformBreakdown";
import { RecentActivity } from "./RecentActivity";
import { DashboardEmptyStateV2 } from "./DashboardEmptyStateV2";
import { AccountAlertsDemo } from "./AccountAlertsDemo";
import { DevFixtureSwitcher } from "./DevFixtureSwitcher";

export function DashboardLayoutV2() {
  const { selectedPeriod, setSelectedPeriod } = useDashboardPeriod();
  const dashboard = useDashboardData(selectedPeriod);
  const { data: user } = useCurrentUser();
  const activeAlerts = useActiveAlerts(dashboard.data?.alerts);
  const t = dashboardV2Strings.errorState;

  const { isVisible: isHeaderVisible } = useHeadroom();

  if (dashboard.isError) {
    return (
      <div className="space-y-6">
        <DashboardHeader
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          onRefresh={() => dashboard.refetch()}
          isRefreshing={dashboard.isFetching}
        />
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          <AlertTitle>{t.title}</AlertTitle>
          <AlertDescription className="mt-2 flex items-center justify-between">
            <span>{t.message}</span>
            <Button size="sm" variant="outline" onClick={() => dashboard.refetch()}>
              {t.cta}
            </Button>
          </AlertDescription>
        </Alert>
        <DevFixtureSwitcher />
      </div>
    );
  }

  const dashboardData = dashboard.data;
  const isLoading = dashboard.isLoading;

  // Empty company → simplified onboarding-style dashboard
  const isNewCompany =
    dashboardData &&
    dashboardData.wallet.balance === 0 &&
    dashboardData.licenseSummary.totalIssuedInPeriod === 0 &&
    dashboardData.recentActivity.length === 0;

  if (isNewCompany) {
    return (
      <div className="space-y-6">
        <DashboardEmptyStateV2 companyName={user?.fullName?.split(" ")[0] ?? "equipo"} />
        <DevFixtureSwitcher />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <FrostedHeader
        intensity="default"
        translateY={isHeaderVisible ? "0" : "-100%"}
        className="md:-top-12 md:-mx-10 md:-mt-12 md:px-10 md:pt-12 md:pb-6 md:pr-10 md:my-[20px]"
      >
        <DashboardHeader
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          freshness={dashboardData?.freshness}
          onRefresh={() => dashboard.refetch()}
          isRefreshing={dashboard.isFetching}
        />
      </FrostedHeader>

      {activeAlerts.length > 0 && <AlertsSection alerts={activeAlerts} />}

      <AccountAlertsDemo />

      <KpiRow kpis={dashboardData?.kpis ?? []} wallet={dashboardData?.wallet} isLoading={isLoading} />

      {/* Main split: chart 8 cols + wallet 4 cols (12-col grid). */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {dashboardData ? (
            <CreditUsageChart data={dashboardData.creditUsage} isLoading={isLoading} />
          ) : (
            <CreditUsageChart
              data={{ points: [], periodTotal: 0, periodAverage: 0, previousPeriodTotal: 0, previousPeriodAverage: 0 }}
              isLoading
            />
          )}
        </div>
        <div className="lg:col-span-4">
          {dashboardData ? (
            <WalletSection wallet={dashboardData.wallet} isLoading={isLoading} />
          ) : (
            <WalletSection
              wallet={{ balance: 0, totalPurchased: 0, consumedInPeriod: 0, expiresAt: null, daysUntilExpiry: null, lowBalanceThreshold: 0, expiryWarningDays: 0 }}
              isLoading
            />
          )}
        </div>
      </div>

      {/* Secondary split: top tracks 7 cols + platform breakdown 5 cols. */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <TopTracks tracks={dashboardData?.topTracks ?? []} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-5">
          <PlatformBreakdown platforms={dashboardData?.platformMetrics ?? []} isLoading={isLoading} />
        </div>
      </div>

      <RecentActivity items={dashboardData?.userActivity ?? []} isLoading={isLoading} />
      <DevFixtureSwitcher />
    </div>
  );
}
