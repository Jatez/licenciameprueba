import { KPICard } from "@/components/ui/kpi-card";
import { auditStrings } from "../strings";

interface Props {
  stats: {
    today: number;
    criticalWeek: number;
    actors: number;
    unreviewed: number;
  };
}

export function AuditStats({ stats }: Props) {
  const t = auditStrings.stats;
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      <KPICard label={t.today.label} value={String(stats.today)} unit="eventos" />
      <KPICard
        label={t.critical.label}
        value={String(stats.criticalWeek)}
        unit="eventos"
        isHighlighted={stats.criticalWeek > 0}
      />
      <KPICard label={t.actors.label} value={String(stats.actors)} unit="actores" />
      <KPICard
        label={t.unreviewed.label}
        value={String(stats.unreviewed)}
        unit="eventos"
        isHighlighted={stats.unreviewed > 0}
      />
    </div>
  );
}
