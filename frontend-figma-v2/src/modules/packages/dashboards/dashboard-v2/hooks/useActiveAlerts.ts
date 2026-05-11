import { useMemo } from "react";
import type { DashboardAlert } from "@/api/types.dashboard";
import { useDashboardStore } from "@/stores/dashboardStore";

export function useActiveAlerts(alerts: DashboardAlert[] | undefined) {
  const dismissedIds = useDashboardStore((s) => s.dismissedAlertIds);
  return useMemo(() => {
    if (!alerts) return [];
    return alerts.filter((a) => !a.dismissible || !dismissedIds.includes(a.id));
  }, [alerts, dismissedIds]);
}
