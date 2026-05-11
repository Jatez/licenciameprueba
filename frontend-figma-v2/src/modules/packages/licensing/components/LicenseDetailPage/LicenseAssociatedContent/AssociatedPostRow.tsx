/**
 * Compact post row used inside /licenses/:id (LicenseAssociatedContent).
 * Smaller than PostCard since the license context is already implicit.
 */
import { useState } from "react";
import { ExternalLink, AlertTriangle, Eye, Music, Unlink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { DetectedPost } from "@/api/types";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";
import { formatRelativeFromNow } from "@/modules/monitoring/tracking/utils/relativeTime";
import { PlatformIcon } from "@/modules/monitoring/tracking/components/shared/PlatformIcon";
import { MatchStatusBadge } from "@/modules/monitoring/tracking/components/shared/MatchStatusBadge";
import { EvidenceBadge } from "@/modules/monitoring/tracking/components/shared/EvidenceBadge";
import { SnapshotViewer } from "@/modules/monitoring/tracking/components/SnapshotViewer";
import { UnlinkDialog } from "@/modules/monitoring/tracking/components/UnlinkDialog";

interface AssociatedPostRowProps {
  post: DetectedPost;
  licenseTokenId: string;
}

export function AssociatedPostRow({ post, licenseTokenId }: AssociatedPostRowProps) {
  const navigate = useNavigate();
  const t = trackingStrings.associatedPostRow;
  const [snapshotOpen, setSnapshotOpen] = useState(false);
  const [unlinkOpen, setUnlinkOpen] = useState(false);

  const isLive = post.evidenceStatus === "live";
  const isPreserved =
    post.postType === "story" && post.evidenceStatus === "ephemeral-preserved";
  const platformLabel = trackingStrings.syncStatus.platformLabels[post.platform];
  const postTypeLabel = trackingStrings.postCard.postType[post.postType];

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <PlatformIcon platform={post.platform} size={14} />
          <span>{platformLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{postTypeLabel}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={post.publishedAt}>
            {trackingStrings.postCard.publishedTime.replace(
              "{relativeTime}",
              formatRelativeFromNow(post.publishedAt),
            )}
          </time>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <MatchStatusBadge status={post.matchStatus} />
          <EvidenceBadge post={post} />
        </div>
      </div>

      <div className="mt-3 flex items-start gap-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-foreground/[0.04]">
          {post.snapshot.thumbnailUrl ? (
            <img
              src={post.snapshot.thumbnailUrl}
              alt=""
              className="h-full w-full rounded-md object-cover"
            />
          ) : (
            <Music size={22} className="text-muted-foreground" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">{t.detectedTitle}</p>
          {post.snapshot.caption && (
            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
              {post.snapshot.caption}
            </p>
          )}
          {post.metrics && (
            <p className="mt-1 text-xs text-muted-foreground">
              {post.metrics.reproductions.toLocaleString("es-CO")}{" "}
              {trackingStrings.postCard.metricsLabels.reproductions} ·{" "}
              {post.metrics.likes.toLocaleString("es-CO")}{" "}
              {trackingStrings.postCard.metricsLabels.likes}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {isLive ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(post.externalUrl, "_blank", "noopener,noreferrer")}
          >
            <ExternalLink size={14} className="mr-1.5" aria-hidden="true" />
            {t.actions.viewPost}
          </Button>
        ) : (
          <Button variant="ghost" size="sm" disabled>
            <AlertTriangle size={14} className="mr-1.5" aria-hidden="true" />
            {t.actions.viewPostDead}
          </Button>
        )}

        {isPreserved && (
          <Button variant="outline" size="sm" onClick={() => setSnapshotOpen(true)}>
            <Eye size={14} className="mr-1.5" aria-hidden="true" />
            {t.actions.viewSnapshot}
          </Button>
        )}

        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard03")}>
          {t.actions.viewMetrics}
        </Button>

        {!isPreserved && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setUnlinkOpen(true)}
            className="text-destructive hover:text-destructive"
          >
            <Unlink size={14} className="mr-1.5" aria-hidden="true" />
            {t.actions.unlink}
          </Button>
        )}
      </div>

      <SnapshotViewer
        open={snapshotOpen}
        onOpenChange={setSnapshotOpen}
        post={post}
        licenseTokenId={licenseTokenId}
      />
      <UnlinkDialog
        open={unlinkOpen}
        onOpenChange={setUnlinkOpen}
        post={post}
        licenseTokenId={licenseTokenId}
      />
    </Card>
  );
}
