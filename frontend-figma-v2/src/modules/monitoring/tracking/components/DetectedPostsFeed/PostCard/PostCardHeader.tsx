import { PlatformIcon } from "../../shared/PlatformIcon";
import { MatchStatusBadge } from "../../shared/MatchStatusBadge";
import { EvidenceBadge } from "../../shared/EvidenceBadge";
import type { DetectedPost } from "@/api/types";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";
import { formatRelativeFromNow } from "@/modules/monitoring/tracking/utils/relativeTime";

interface PostCardHeaderProps {
  post: DetectedPost;
}

export function PostCardHeader({ post }: PostCardHeaderProps) {
  const t = trackingStrings.postCard;
  const postTypeLabel = t.postType[post.postType];
  const publishedLabel = t.publishedTime.replace(
    "{relativeTime}",
    formatRelativeFromNow(post.publishedAt),
  );

  return (
    <header className="flex flex-wrap items-center gap-2">
      <PlatformIcon platform={post.platform} size={16} />
      <span className="rounded-md bg-foreground/[0.04] px-1.5 py-0.5 text-xs font-medium text-foreground">
        {postTypeLabel}
      </span>
      <span className="text-xs text-muted-foreground">{publishedLabel}</span>
      <div className="ml-auto flex items-center gap-2">
        <EvidenceBadge post={post} />
        <MatchStatusBadge status={post.matchStatus} />
      </div>
    </header>
  );
}
