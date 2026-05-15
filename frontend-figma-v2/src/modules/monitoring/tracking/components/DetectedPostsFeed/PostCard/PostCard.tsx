import { useId, useState } from "react";
import { Card } from "@/components/ui/card";
import type { DetectedPost } from "@/api/types";
import { PostCardHeader } from "./PostCardHeader";
import { PostCardBody } from "./PostCardBody";
import { PostCardMetrics } from "./PostCardMetrics";
import { PostCardActions } from "./PostCardActions";
import { PostDetailDrawer } from "../../PostDetailDrawer/PostDetailDrawer";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";

interface PostCardProps {
  post: DetectedPost;
}

/**
 * Single post card. Renders different sub-blocks based on `matchStatus`:
 * - matched-auto / matched-manual: full body + metrics + actions.
 * - pending-match: header + placeholder, no actions.
 * - no-match-found: header + explanation + manual link CTA.
 * - unlinked: header + reason + relink CTA.
 * - expired-before-publish: header + explanation only.
 *
 * Story countdown is owned by EvidenceBadge (auto-refreshing every minute).
 * Clicking anywhere on the card opens the PostDetailDrawer.
 */
export function PostCard({ post }: PostCardProps) {
  const titleId = useId();
  const t = trackingStrings.postCard;
  const { matchStatus, postType, evidenceStatus, evidenceExpiresAt } = post;
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isStoryLive =
    postType === "story" && evidenceStatus === "live" && !!evidenceExpiresAt;
  const isStoryExpired =
    postType === "story" && evidenceStatus === "ephemeral-preserved";

  return (
    <>
      <article
        aria-labelledby={titleId}
        className="rounded-lg cursor-pointer"
        onClick={() => setDrawerOpen(true)}
      >
        <Card className="p-4 hover:ring-1 hover:ring-border transition-shadow">
          <div className="flex flex-col gap-3">
            <PostCardHeader post={post} />
            <PostCardBody post={post} titleId={titleId} />

            {isStoryLive && (
              <p className="text-xs text-muted-foreground">
                {t.storyExpiresIn.replace(
                  "{duration}",
                  trackingStrings.postCard.evidenceStatus.ephemeralLive,
                )}
              </p>
            )}
            {isStoryExpired && (
              <p className="text-xs text-muted-foreground">
                {t.storyExpired.replace(
                  "{platform}",
                  trackingStrings.syncStatus.platformLabels[post.platform],
                )}
              </p>
            )}

            {/* Show metrics for ALL statuses that have metric data */}
            <PostCardMetrics post={post} />

            {matchStatus !== "pending-match" &&
              matchStatus !== "expired-before-publish" && (
                <div onClick={(e) => e.stopPropagation()}>
                  <PostCardActions post={post} />
                </div>
              )}
          </div>
        </Card>
      </article>

      <PostDetailDrawer
        postId={post.id}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
}
