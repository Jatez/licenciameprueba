import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlatformBadge, type PlatformId } from "@/components/ui/platform-badge";
import type { PlatformMetrics, SocialPlatformV2 } from "@/api/types.dashboard";
import { dashboardV2Strings, fmt, plural } from "../../strings";
import { useFormatCompactNumber } from "../../hooks";
import { buildSparklinePath } from "../../utils/buildSparklinePath";

interface PlatformCardProps {
  metrics: PlatformMetrics;
}

const PLATFORM_LABEL: Record<SocialPlatformV2, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
};

export function PlatformCard({ metrics }: PlatformCardProps) {
  const navigate = useNavigate();
  const formatCompact = useFormatCompactNumber();
  const t = dashboardV2Strings.platformBreakdown;
  const label = PLATFORM_LABEL[metrics.platform];

  if (!metrics.connected) {
    return (
      <Card className="flex items-center gap-3 border-dashed bg-muted/40 p-4">
        <PlatformBadge platform={metrics.platform as PlatformId} size="md" className="opacity-60" />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-sm font-medium text-foreground">{label}</span>
          <span className="text-xs text-muted-foreground">{t.notConnected}</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate("/social-accounts")}
          className="shrink-0"
        >
          <Plus className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
          Conectar
        </Button>
      </Card>
    );
  }

  return (
    <Card className="flex items-center gap-3 p-4">
      <PlatformBadge platform={metrics.platform as PlatformId} size="md" />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-foreground">{label}</span>
          {metrics.handle && (
            <span className="truncate text-xs text-muted-foreground">{metrics.handle}</span>
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-foreground font-tnum leading-tight">
            {metrics.postsCount}
          </span>
          <span className="text-xs text-muted-foreground">
            {plural({ one: t.postSingular, other: t.postPlural }, metrics.postsCount)}
          </span>
        </div>
        <span className="text-xs text-muted-foreground font-tnum">
          {fmt("{n} impresiones", { n: formatCompact(metrics.impressions) })}
        </span>
      </div>
      {metrics.sparkline && metrics.sparkline.length > 0 && (
        <div className="hidden w-20 sm:block">
          <PlatformSparkline values={metrics.sparkline} ariaLabel={`Tendencia de ${label}`} />
        </div>
      )}
    </Card>
  );
}

function PlatformSparkline({ values, ariaLabel }: { values: number[]; ariaLabel: string }) {
  const { line, area } = buildSparklinePath(values, 80, 40);
  return (
    <svg
      viewBox="0 0 80 40"
      preserveAspectRatio="none"
      className="h-10 w-full"
      role="img"
      aria-label={ariaLabel}
    >
      <path d={area} fill="hsl(var(--color-gray-100))" opacity={0.55} />
      <path
        d={line}
        fill="none"
        stroke="hsl(var(--foreground))"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
