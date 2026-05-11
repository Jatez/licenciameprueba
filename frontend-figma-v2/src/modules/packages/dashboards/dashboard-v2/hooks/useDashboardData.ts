import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { api } from "@/api";
import type { DashboardDataV2, DashboardFixture, DashboardPeriod } from "@/api/types.dashboard";

export const DASHBOARD_V2_QUERY_KEY = "dashboard-v2";

const VALID_FIXTURES: DashboardFixture[] = ["default", "newCompany", "lowBalance", "error"];

/**
 * Loads the V2 dashboard payload.
 * Dev override: append `?fixture=newCompany|lowBalance|error|default` to the URL
 * to force a specific scenario without touching code.
 */
export function useDashboardData(period: DashboardPeriod) {
  const [searchParams] = useSearchParams();
  const fixtureParam = searchParams.get("fixture") as DashboardFixture | null;
  const fixture: DashboardFixture =
    fixtureParam && VALID_FIXTURES.includes(fixtureParam) ? fixtureParam : "default";

  return useQuery<DashboardDataV2>({
    queryKey: [DASHBOARD_V2_QUERY_KEY, period, fixture],
    queryFn: () => api.dashboardV2.getData(period, fixture),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    retry: fixture === "error" ? false : 1,
  });
}
