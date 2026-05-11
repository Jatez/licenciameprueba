import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { PlatformMetrics } from "@/api/types.dashboard";
import { dashboardV2Strings } from "../../strings";
import { PlatformCard } from "./PlatformCard";

interface PlatformBreakdownProps {
  platforms: PlatformMetrics[];
  isLoading?: boolean;
}

export function PlatformBreakdown({ platforms, isLoading }: PlatformBreakdownProps) {
  const t = dashboardV2Strings.platformBreakdown;

  if (isLoading) {
    return (
      <Card className="flex h-full flex-col gap-4 p-6">
        <Skeleton className="h-5 w-48" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex h-full flex-col gap-4 p-6">
      <div>
        <h2 className="text-base font-semibold text-foreground">{t.title}</h2>
        <p className="text-xs text-muted-foreground">Cuentas conectadas y sus métricas</p>
      </div>
      <div className="flex flex-col gap-3">
        {platforms.map((p) => (
          <PlatformCard key={p.platform} metrics={p} />
        ))}
      </div>
    </Card>
  );
}
