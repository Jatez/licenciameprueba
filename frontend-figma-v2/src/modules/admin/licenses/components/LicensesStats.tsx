import { KPICard } from "@/components/ui/kpi-card";
import { licensesStrings } from "../strings";

interface Props {
  stats: { active: number; issued30d: number; expired: number; disputed: number };
}

export function LicensesStats({ stats }: Props) {
  const t = licensesStrings.stats;
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      <KPICard label={t.active.label} value={String(stats.active)} unit="licencias" />
      <KPICard label={t.issued30d.label} value={String(stats.issued30d)} unit="licencias" />
      <KPICard label={t.expired.label} value={String(stats.expired)} unit="licencias" />
      <KPICard
        label={t.disputed.label}
        value={String(stats.disputed)}
        unit="casos"
        isHighlighted={stats.disputed > 0}
      />
    </div>
  );
}
