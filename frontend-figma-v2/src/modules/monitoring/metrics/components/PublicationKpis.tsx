import { Card } from "@/components/ui/card";
import { formatCount } from "@/shared/utils";
import { metricsStrings } from "@/modules/monitoring/metrics/strings";
import type { PublicationMetric } from "@/modules/monitoring/metrics/types";

export interface PublicationKpisProps {
  pub: PublicationMetric;
}

export function PublicationKpis({ pub }: PublicationKpisProps) {
  const t = metricsStrings.publicationDetail;
  const items: Array<{ label: string; value: number }> = [
    { label: t.kpis.views, value: pub.views },
    { label: t.kpis.likes, value: pub.likes },
    { label: t.kpis.comments, value: pub.comments },
    { label: t.kpis.shares, value: pub.shares },
    { label: t.kpis.saves, value: pub.saves },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {items.map((k) => (
        <Card key={k.label} className="flex flex-col gap-1 p-3">
          <p className="text-[11px] uppercase tracking-wide text-foreground/50">{k.label}</p>
          <p className="font-tnum text-xl font-bold text-foreground">{formatCount(k.value)}</p>
        </Card>
      ))}
    </div>
  );
}