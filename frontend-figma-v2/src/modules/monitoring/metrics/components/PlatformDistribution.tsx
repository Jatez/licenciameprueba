/**
 * F-11 · Platform distribution: 3 mini-cards (IG, TikTok, Facebook).
 *
 * Each card shows: <PlatformBadge> + label + publications + compact views +
 * engagement % + a thin progress bar showing % share over the total.
 *
 * "Not connected" placeholder reserved for the future onboarding state.
 */
import { Card } from "@/components/ui/card";
import { PlatformBadge } from "@/components/ui/platform-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompactNumber, formatPercent } from "@/shared/format";
import type { MetricsOverview, SocialPlatform } from "../types";
import { metricsStrings, platformLabels } from "../strings";

interface PlatformDistributionProps {
  overview: MetricsOverview | null;
  isLoading: boolean;
}

const PLATFORMS: SocialPlatform[] = ["instagram", "tiktok", "facebook"];

const PLATFORM_METRIC_LABELS = {
  publications: "pub.",
  views: "reprod.",
  engagement: "eng.",
} as const;

export function PlatformDistribution({ overview, isLoading }: PlatformDistributionProps) {
  if (isLoading || !overview) {
    return (
      <Card className="flex h-full flex-col gap-2.5 p-3.5">
        <h3 className="text-sm font-semibold text-foreground">
          {metricsStrings.platforms.title}
        </h3>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[62px] w-full rounded-lg" />
        ))}
      </Card>
    );
  }

  const totalPubs = overview.byPlatform.reduce((s, p) => s + p.publications, 0);

  return (
    <Card className="flex h-full flex-col gap-2.5 p-3.5">
      <h3 className="text-sm font-semibold text-foreground">
        {metricsStrings.platforms.title}
      </h3>
      <ul className="flex flex-1 flex-col gap-2.5">
        {PLATFORMS.map((platform) => {
          const entry = overview.byPlatform.find((b) => b.platform === platform);
          const pubs = entry?.publications ?? 0;
          const views = entry?.views ?? 0;
          const engagement = entry?.engagementRate ?? 0;
          const share = totalPubs === 0 ? 0 : (pubs / totalPubs) * 100;

          return (
            <li
              key={platform}
              className="flex items-start gap-2.5 rounded-lg border border-foreground/5 p-2.5"
            >
              <PlatformBadge platform={platform} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium text-foreground">
                    {platformLabels[platform]}
                  </span>
                  <span className="font-tnum shrink-0 text-xs text-foreground/60">
                    {formatPercent(share, { decimals: 0 })}
                  </span>
                </div>
                <div className="mt-1.5 grid grid-cols-3 gap-1.5 font-tnum">
                  <Metric
                    value={String(pubs)}
                    label={PLATFORM_METRIC_LABELS.publications}
                  />
                  <Metric
                    value={formatCompactNumber(views)}
                    label={PLATFORM_METRIC_LABELS.views}
                  />
                  <Metric
                    value={formatPercent(engagement, { decimals: 1 })}
                    label={PLATFORM_METRIC_LABELS.engagement}
                  />
                </div>
                <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-foreground/5">
                  <div
                    className="h-full bg-foreground/70 transition-all"
                    style={{ width: `${share}%` }}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex min-w-0 flex-col">
      <span className="truncate text-[15px] font-semibold text-foreground">{value}</span>
      <span className="truncate text-[10px] uppercase tracking-wide text-foreground/55">
        {label}
      </span>
    </div>
  );
}
