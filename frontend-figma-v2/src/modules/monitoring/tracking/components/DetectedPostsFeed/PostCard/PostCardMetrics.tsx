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

  // Prefer explicit top-level counts, fall back to nested metrics object
  const likes = post.likeCount ?? post.metrics?.likes ?? null;
  const views = post.viewCount ?? post.metrics?.reproductions ?? null;
  const comments = post.commentCount ?? null;
  const shares = post.metrics?.shares ?? null;
  const lastUpdated = post.metrics?.lastUpdatedAt ?? null;

  const hasAny = [likes, views, comments, shares].some((v) => v != null && v > 0);

  if (!hasAny && !post.metrics) return null;

  const parts: string[] = [];
  if (views != null && views > 0) parts.push(`${formatNumber(views)} ${t.metricsLabels.reproductions}`);
  if (likes != null && likes > 0) parts.push(`${formatNumber(likes)} ${t.metricsLabels.likes}`);
  if (comments != null && comments > 0) parts.push(`${formatNumber(comments)} comentarios`);
  if (shares != null && shares > 0) parts.push(`${formatNumber(shares)} ${t.metricsLabels.shares}`);

  return (
    <div className="text-xs text-muted-foreground">
      <p className="text-foreground">{parts.join(" · ") || "—"}</p>
      {lastUpdated && (
        <p className="mt-0.5">
          {t.metricsUpdated.replace("{duration}", formatRelativeFromNow(lastUpdated))}
        </p>
      )}
    </div>
  );
}
