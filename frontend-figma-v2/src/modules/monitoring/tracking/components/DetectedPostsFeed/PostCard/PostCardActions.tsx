import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink, AlertTriangle, Eye, Link2, EyeOff, Unlink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DetectedPost } from "@/api/types";
import { useTrackingStore } from "@/stores/trackingStore";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";
import { UnlinkConfirmDialog } from "./UnlinkConfirmDialog";
import { SnapshotDialog } from "./SnapshotDialog";

interface PostCardActionsProps {
  post: DetectedPost;
}

export function PostCardActions({ post }: PostCardActionsProps) {
  const navigate = useNavigate();
  const openManualLink = useTrackingStore((s) => s.openManualLinkDialog);
  const [unlinkOpen, setUnlinkOpen] = useState(false);
  const [snapshotOpen, setSnapshotOpen] = useState(false);
  const t = trackingStrings.postCard.actions;

  const isLive = post.evidenceStatus === "live";
  const isStoryPreserved =
    post.postType === "story" && post.evidenceStatus === "ephemeral-preserved";
  const isMatched =
    post.matchStatus === "matched-auto" || post.matchStatus === "matched-manual";

  const viewPost = () => window.open(post.externalUrl, "_blank", "noopener,noreferrer");

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {isMatched && (
          <>
            {isLive ? (
              <Button variant="outline" size="sm" onClick={viewPost}>
                <ExternalLink size={14} className="mr-1.5" aria-hidden="true" />
                {t.viewPost}
              </Button>
            ) : (
              <Button variant="ghost" size="sm" disabled>
                <AlertTriangle size={14} className="mr-1.5" aria-hidden="true" />
                {t.viewPostDead}
              </Button>
            )}

            {isStoryPreserved && (
              <Button variant="outline" size="sm" onClick={() => setSnapshotOpen(true)}>
                <Eye size={14} className="mr-1.5" aria-hidden="true" />
                {t.viewSnapshot}
              </Button>
            )}

            {post.licenseId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/licenses/${post.licenseId}`)}
              >
                {t.viewLicense}
              </Button>
            )}

            {/* Unlink not allowed once evidence is preserved (historical record). */}
            {post.licenseId && !isStoryPreserved && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUnlinkOpen(true)}
                className="text-destructive hover:text-destructive"
              >
                <Unlink size={14} className="mr-1.5" aria-hidden="true" />
                {t.unlink}
              </Button>
            )}
          </>
        )}

        {post.matchStatus === "no-match-found" && (
          <>
            <Button
              size="sm"
              onClick={() =>
                openManualLink(undefined, {
                  externalUrl: post.externalUrl,
                  platform: post.platform,
                  publishedAt: post.publishedAt,
                })
              }
            >
              <Link2 size={14} className="mr-1.5" aria-hidden="true" />
              {t.linkManually}
            </Button>
            <Button variant="ghost" size="sm">
              <EyeOff size={14} className="mr-1.5" aria-hidden="true" />
              {t.ignore}
            </Button>
          </>
        )}

        {post.matchStatus === "unlinked" && (
          <>
            <Button
              size="sm"
              onClick={() =>
                openManualLink(undefined, {
                  externalUrl: post.externalUrl,
                  platform: post.platform,
                  publishedAt: post.publishedAt,
                })
              }
            >
              {t.relink}
            </Button>
            <Button variant="ghost" size="sm">
              {t.hide}
            </Button>
          </>
        )}
      </div>

      {post.licenseId && (
        <UnlinkConfirmDialog
          open={unlinkOpen}
          onOpenChange={setUnlinkOpen}
          postId={post.id}
          licenseId={post.licenseId}
        />
      )}
      <SnapshotDialog
        open={snapshotOpen}
        onOpenChange={setSnapshotOpen}
        post={post}
      />
    </>
  );
}
