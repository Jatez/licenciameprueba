import type { ReactNode } from "react";

interface KpiCardProps {
  label: string;
  value: ReactNode;
  footer: ReactNode;
}

/**
 * Editorial KPI card: white surface, generous padding, large display number.
 */
export function KpiCard({ label, value, footer }: KpiCardProps) {
  return (
    <article className="flex flex-col gap-6 rounded-lg border border-border bg-card p-7 md:p-8">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="font-serif text-5xl leading-none text-foreground md:text-6xl">
        {value}
      </p>
      <div className="text-sm text-muted-foreground">{footer}</div>
    </article>
  );
}
