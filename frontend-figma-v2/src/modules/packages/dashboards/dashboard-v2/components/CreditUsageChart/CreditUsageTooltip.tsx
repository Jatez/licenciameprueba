import type { TooltipProps } from "recharts";
import type { LicenseUsageType } from "@/api/types.dashboard";
import { dashboardV2Strings } from "../../strings";
import { USAGE_TYPE_COLORS } from "./CreditUsageLegend";

const dateFormatter = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short" });

export function CreditUsageTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const labels = dashboardV2Strings.creditUsage.usageTypes;
  const total = payload.reduce((sum, p) => sum + (typeof p.value === "number" ? p.value : 0), 0);

  return (
    <div className="rounded-lg border border-border bg-popover p-3 shadow-md">
      <p className="mb-2 text-xs font-medium text-foreground">
        {label ? dateFormatter.format(new Date(label)).toLowerCase() : ""}
      </p>
      <ul className="flex flex-col gap-1 text-xs">
        {payload.map((p) => (
          <li key={p.dataKey as string} className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block h-2 w-2 rounded-sm"
              style={{ backgroundColor: USAGE_TYPE_COLORS[p.dataKey as LicenseUsageType] }}
            />
            <span className="text-muted-foreground">{labels[p.dataKey as string]}:</span>
            <span className="font-medium text-foreground font-tnum">{p.value}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 border-t pt-1.5 text-xs font-semibold text-foreground">
        Total: <span className="font-tnum">{total}</span> créditos
      </p>
    </div>
  );
}
