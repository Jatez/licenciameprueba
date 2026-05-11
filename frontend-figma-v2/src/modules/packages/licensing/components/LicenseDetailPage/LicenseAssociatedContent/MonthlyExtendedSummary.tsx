import { BarChart3, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { DetectedPost, License, SocialPlatformF06 } from "@/api/types";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";

interface MonthlyExtendedSummaryProps {
  license: License;
  posts: DetectedPost[];
}

export function MonthlyExtendedSummary({ license, posts }: MonthlyExtendedSummaryProps) {
  const navigate = useNavigate();
  const t = trackingStrings.associatedContent.monthlyExtended;

  const issuedAt = new Date(license.issuedAt).getTime();
  const expiresAt = license.expiresAt
    ? new Date(license.expiresAt).getTime()
    : issuedAt + 30 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const elapsedDays = Math.max(1, Math.round((now - issuedAt) / (24 * 60 * 60 * 1000)));
  const daysToExpire = Math.max(0, Math.round((expiresAt - now) / (24 * 60 * 60 * 1000)));
  const totalDays = Math.max(1, Math.round((expiresAt - issuedAt) / (24 * 60 * 60 * 1000)));
  const progress = Math.min(100, Math.round((elapsedDays / totalDays) * 100));

  const totalImpressions = posts.reduce(
    (acc, p) => acc + (p.metrics?.impressions ?? 0),
    0,
  );
  const totalLikes = posts.reduce((acc, p) => acc + (p.metrics?.likes ?? 0), 0);

  const byPlatform: Partial<Record<SocialPlatformF06, number>> = {};
  for (const p of posts) {
    byPlatform[p.platform] = (byPlatform[p.platform] ?? 0) + 1;
  }

  const countLabel =
    posts.length === 1
      ? t.postsCountSingular.replace("{count}", "1").replace("{days}", String(elapsedDays))
      : t.postsCountPlural
          .replace("{count}", String(posts.length))
          .replace("{days}", String(elapsedDays));

  const expiresLabel =
    daysToExpire === 0 ? t.expiresToday : t.expiresIn.replace("{days}", String(daysToExpire));

  return (
    <Card className="space-y-3 p-4">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-info-subtle text-info">
          <BarChart3 size={18} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-foreground">{t.title}</h3>
          <p className="text-xs text-muted-foreground">{countLabel}</p>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{expiresLabel}</span>
          <span className="font-tnum">{progress}%</span>
        </div>
        <Progress value={progress} aria-label={expiresLabel} />
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-md bg-foreground/[0.03] p-2">
          <p className="text-xs text-muted-foreground">
            <TrendingUp size={11} className="mr-1 inline" aria-hidden="true" />
            {t.totalImpressions.replace(
              "{count}",
              totalImpressions.toLocaleString("es-CO"),
            )}
          </p>
        </div>
        <div className="rounded-md bg-foreground/[0.03] p-2">
          <p className="text-xs text-muted-foreground">
            {t.totalLikes.replace("{count}", totalLikes.toLocaleString("es-CO"))}
          </p>
        </div>
      </div>

      {Object.keys(byPlatform).length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(byPlatform) as SocialPlatformF06[]).map((platform) => (
            <span
              key={platform}
              className="rounded-full bg-foreground/[0.05] px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              {t.platformBreakdown
                .replace("{count}", String(byPlatform[platform]))
                .replace(
                  "{platform}",
                  trackingStrings.syncStatus.platformLabels[platform],
                )}
            </span>
          ))}
        </div>
      )}

      <Button
        variant="link"
        size="sm"
        className="self-start px-0"
        onClick={() => navigate(`/dashboard03?licenseId=${license.id}`)}
      >
        {t.viewMetricsCta} →
      </Button>
    </Card>
  );
}
