import { CheckCircle2, Clock, FileText, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LicenseListAggregates, LicenseStatusFull } from "@/api/types";
import { Skeleton } from "@/components/ui/skeleton";
import { licensingStrings } from "@/modules/packages/licensing/strings";

interface Props {
  aggregates: LicenseListAggregates | undefined;
  isLoading: boolean;
  activeStatuses: LicenseStatusFull[];
  onToggleStatus: (status: LicenseStatusFull) => void;
}

interface StatConfig {
  status: LicenseStatusFull;
  label: string;
  count: number;
  icon: LucideIcon;
  iconClass: string;
}

export function LicensesAggregateStats({
  aggregates,
  isLoading,
  activeStatuses,
  onToggleStatus,
}: Props) {
  const t = licensingStrings.list.aggregates;

  if (isLoading || !aggregates) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  const stats: StatConfig[] = [
    {
      status: "active",
      label: t.active,
      count: aggregates.totalActive,
      icon: CheckCircle2,
      iconClass: "text-success",
    },
    {
      status: "consumed",
      label: t.consumed,
      count: aggregates.totalConsumed,
      icon: FileText,
      iconClass: "text-info",
    },
    {
      status: "expired",
      label: t.expired,
      count: aggregates.totalExpired,
      icon: Clock,
      iconClass: "text-muted-foreground",
    },
    {
      status: "cancelled",
      label: t.cancelled,
      count: aggregates.totalCancelled,
      icon: XCircle,
      iconClass: "text-destructive",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s) => {
        const Icon = s.icon;
        const isActive = activeStatuses.includes(s.status);
        return (
          <button
            key={s.status}
            type="button"
            onClick={() => onToggleStatus(s.status)}
            aria-pressed={isActive}
            className={cn(
              "rounded-xl border bg-card p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-foreground/20",
            )}
          >
            <div className="flex items-center gap-2">
              <Icon className={cn("h-4 w-4", s.iconClass)} aria-hidden="true" />
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {s.label}
              </span>
            </div>
            <div className="mt-2 text-2xl font-semibold tabular-nums text-foreground">
              {s.count}
            </div>
          </button>
        );
      })}
    </div>
  );
}
