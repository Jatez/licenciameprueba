import { KPICard } from "@/components/ui/kpi-card";
import type { AdminMetricMock } from "../mocks/adminMocks";
import { adminStrings } from "../strings";

interface AdminMetricCardProps {
  metric: AdminMetricMock;
  isLoading?: boolean;
}

/**
 * Thin wrapper over the design-system KPICard so the admin overview
 * stays consistent with the rest of the app and responds to tokens.
 */
export function AdminMetricCard({ metric, isLoading }: AdminMetricCardProps) {
  const copy = adminStrings.metrics[metric.key];
  return (
    <KPICard
      label={copy.label}
      value={metric.value}
      unit={metric.unit}
      trend={metric.trend}
      delta={{
        value: metric.delta.value,
        percent: metric.delta.percent,
        period: "vs período anterior",
        sentiment: metric.delta.sentiment,
      }}
      isHighlighted={metric.highlighted}
      isLoading={isLoading}
      ariaLabel={`${copy.label}: ${metric.value} ${metric.unit ?? ""}`.trim()}
    />
  );
}
