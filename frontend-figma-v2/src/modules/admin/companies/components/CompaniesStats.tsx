import { KPICard } from "@/components/ui/kpi-card";
import { companiesStrings } from "../strings";

interface Props {
  stats: { total: number; active: number; suspended: number; creditsCirculating: number };
}

export function CompaniesStats({ stats }: Props) {
  const t = companiesStrings.stats;
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      <KPICard label={t.total.label} value={String(stats.total)} unit="empresas" />
      <KPICard label={t.active.label} value={String(stats.active)} unit="empresas" />
      <KPICard
        label={t.suspended.label}
        value={String(stats.suspended)}
        unit="empresas"
        isHighlighted={stats.suspended > 0}
      />
      <KPICard
        label={t.creditsCirculating.label}
        value={stats.creditsCirculating.toLocaleString("es-CO")}
        unit="créditos"
      />
    </div>
  );
}
