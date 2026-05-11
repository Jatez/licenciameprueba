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

export function PlatformDistribution({ overview, isLoading }: PlatformDistributionProps) {
  if (isLoading || !overview) {
    return (
      <Card className="flex flex-col gap-3 p-4">
        <h3 className="text-sm font-semibold text-foreground">
          {metricsStrings.platforms.title}
        </h3>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </Card>
    );
  }

  const totalPubs = overview.byPlatform.reduce((s, p) => s + p.publications, 0);

  return (
    <Card className="flex flex-col gap-3 p-4 pt-mobile-stack-lg">
      <h3 className="text-sm font-semibold text-foreground pt-mobile-stack-lg">
        {metricsStrings.platforms.title}
      </h3>
      <ul className="flex flex-col gap-3">
        {PLATFORMS.map((platform) => {
          const entry = overview.byPlatform.find((b) => b.platform === platform);
          const pubs = entry?.publications ?? 0;
          const views = entry?.views ?? 0;
          const engagement = entry?.engagementRate ?? 0;
          const share = totalPubs === 0 ? 0 : (pubs / totalPubs) * 100;

          return (
            <li
              key={platform}
              className="flex items-start gap-3 rounded-lg border border-foreground/5 p-3"
            >
              <PlatformBadge platform={platform} size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium text-foreground">
                    {platformLabels[platform]}
                  </span>
                  <span className="font-tnum shrink-0 text-xs text-foreground/60">
                    {formatPercent(share, { decimals: 0 })}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 font-tnum">
                  <Metric
                    value={String(pubs)}
                    label={metricsStrings.platforms.publications.toLowerCase()}
                  />
                  <Metric
                    value={formatCompactNumber(views)}
                    label={metricsStrings.platforms.views.toLowerCase()}
                  />
                  <Metric
                    value={formatPercent(engagement, { decimals: 1 })}
                    label={metricsStrings.platforms.engagement.toLowerCase()}
                  />
                </div>
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-foreground/5">
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
      <span className="truncate text-sm font-semibold text-foreground">{value}</span>
      <span className="truncate text-[10px] uppercase tracking-wide text-foreground/55">
        {label}
      </span>
    </div>
  );
}
