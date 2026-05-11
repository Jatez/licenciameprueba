import type { DashboardAlert, AlertSeverity } from "@/api/types.dashboard";
import { useDashboardStore } from "@/stores/dashboardStore";
import { AlertBanner } from "./AlertBanner";

interface AlertsSectionProps {
  alerts: DashboardAlert[];
}

const severityOrder: Record<AlertSeverity, number> = { critical: 0, warning: 1, info: 2 };

export function AlertsSection({ alerts }: AlertsSectionProps) {
  const dismissAlert = useDashboardStore((s) => s.dismissAlert);

  if (!alerts.length) return null;

  const sorted = [...alerts].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
  const current = sorted[0];

  return (
    <section aria-label="Alertas" aria-live="polite" className="flex flex-col">
      <AlertBanner key={current.id} alert={current} onDismiss={dismissAlert} />
    </section>
  );
}
