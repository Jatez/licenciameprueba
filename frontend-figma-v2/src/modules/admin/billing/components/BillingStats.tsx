import { KPICard } from "@/components/ui/kpi-card";
import { billingStrings } from "../strings";
import { formatCop } from "../mocks";

interface Props {
  stats: { revenue30d: number; pending: number; failed: number; creditNotes: number };
}

export function BillingStats({ stats }: Props) {
  const t = billingStrings.stats;
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      <KPICard label={t.revenue30d.label} value={formatCop(stats.revenue30d)} unit="COP" />
      <KPICard
        label={t.pending.label}
        value={String(stats.pending)}
        unit="facturas"
        isHighlighted={stats.pending > 0}
      />
      <KPICard
        label={t.failed.label}
        value={String(stats.failed)}
        unit="pagos"
        isHighlighted={stats.failed > 0}
      />
      <KPICard label={t.creditNotes.label} value={String(stats.creditNotes)} unit="notas" />
    </div>
  );
}
