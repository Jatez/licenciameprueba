import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface WalletKpiCardProps {
  id: string;
  icon: LucideIcon;
  label: string;
  value: string;
  unit?: string;
  hint?: string;
  emphasis?: boolean;
}

export function WalletKpiCard({
  id,
  icon: Icon,
  label,
  value,
  unit,
  hint,
  emphasis,
}: WalletKpiCardProps) {
  const labelId = `${id}-label`;
  return (
    <Card
      role="article"
      aria-labelledby={labelId}
      className={cn(
        "transition-shadow hover:shadow-md",
        emphasis && "border-metric/40 bg-metric-subtle/40",
      )}
    >
      <CardContent className="space-y-2 p-5">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icon className="h-4 w-4" aria-hidden="true" />
          <span id={labelId} className="text-xs font-medium uppercase tracking-wide">
            {label}
          </span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-semibold tracking-tight text-foreground">
            {value}
          </span>
          {unit ? (
            <span className="text-sm text-muted-foreground">{unit}</span>
          ) : null}
        </div>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}
