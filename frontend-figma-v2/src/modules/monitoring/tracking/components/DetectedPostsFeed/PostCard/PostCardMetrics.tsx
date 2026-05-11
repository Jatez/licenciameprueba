import type { DetectedPost } from "@/api/types";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";
import { formatRelativeFromNow } from "@/modules/monitoring/tracking/utils/relativeTime";

interface PostCardMetricsProps {
  post: DetectedPost;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function PostCardMetrics({ post }: PostCardMetricsProps) {
  const t = trackingStrings.postCard;

  if (!post.metrics) {
    return (
      <p className="text-xs text-muted-foreground">{t.metricsPending}</p>
    );
  }

  const m = post.metrics;
  const parts: string[] = [];

  if (m.reproductions > 0)
    parts.push(`${formatNumber(m.reproductions)} ${t.metricsLabels.reproductions}`);
  if (m.likes > 0) parts.push(`${formatNumber(m.likes)} ${t.metricsLabels.likes}`);
  if (m.shares > 0) parts.push(`${formatNumber(m.shares)} ${t.metricsLabels.shares}`);

  return (
    <div className="text-xs text-muted-foreground">
      <p className="text-foreground">{parts.join(" · ") || "—"}</p>
      <p className="mt-0.5">
        {t.metricsUpdated.replace("{duration}", formatRelativeFromNow(m.lastUpdatedAt))}
      </p>
    </div>
  );
}
