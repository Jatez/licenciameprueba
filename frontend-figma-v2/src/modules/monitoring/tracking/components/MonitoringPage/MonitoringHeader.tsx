import { trackingStrings } from "@/modules/monitoring/tracking/strings";

export function MonitoringHeader() {
  const t = trackingStrings.monitoring;
  return (
    <header className="space-y-1">
      <h1 className="text-2xl font-semibold text-foreground">{t.title}</h1>
      <p className="text-sm text-muted-foreground">{t.subtitle}</p>
    </header>
  );
}
