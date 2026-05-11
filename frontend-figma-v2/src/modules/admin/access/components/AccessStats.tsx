import { KPICard } from "@/components/ui/kpi-card";
import { accessStrings } from "../strings";

interface Props {
  stats: { total: number; active: number; pending: number; superAdmins: number };
}

export function AccessStats({ stats }: Props) {
  const t = accessStrings.stats;
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      <KPICard label={t.total} value={String(stats.total)} unit="usuarios" />
      <KPICard label={t.active} value={String(stats.active)} unit="usuarios" />
      <KPICard
        label={t.pending}
        value={String(stats.pending)}
        unit="invitaciones"
        isHighlighted={stats.pending > 0}
      />
      <KPICard label={t.superAdmins} value={String(stats.superAdmins)} unit="cuentas" />
    </div>
  );
}
