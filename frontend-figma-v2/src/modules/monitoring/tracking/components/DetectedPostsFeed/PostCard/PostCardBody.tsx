import { Link } from "react-router-dom";
import { Music } from "lucide-react";
import type { DetectedPost } from "@/api/types";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";

interface PostCardBodyProps {
  post: DetectedPost;
  titleId: string;
  /** Optional usage type label resolved from the linked license. */
  licenseUsageLabel?: string;
}

export function PostCardBody({ post, titleId, licenseUsageLabel }: PostCardBodyProps) {
  const t = trackingStrings.postCard;
  const { matchStatus, snapshot, licenseId } = post;

  if (!snapshot) {
    return null;
  }

  return (
    <div className="flex gap-3">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-foreground/[0.04]">
        {snapshot.thumbnailUrl ? (
          <img
            src={snapshot.thumbnailUrl}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <Music size={20} aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        {(matchStatus === "matched-auto" || matchStatus === "matched-manual") && (
          <>
            <p id={titleId} className="truncate text-sm font-semibold text-foreground">
              "{snapshot.detectedTrackTitle}" — {snapshot.detectedArtist}
            </p>
            {licenseId && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                <Link
                  to={`/licenses/${licenseId}`}
                  className="underline-offset-2 hover:underline"
                >
                  {t.associatedTo
                    .replace("{licenseId}", licenseId)
                    .replace("{usageType}", licenseUsageLabel ?? "—")}
                </Link>
              </p>
            )}
          </>
        )}

        {matchStatus === "pending-match" && (
          <>
            <p id={titleId} className="text-sm font-semibold text-foreground">
              {t.pendingTitle}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{t.pendingMessage}</p>
          </>
        )}

        {matchStatus === "no-match-found" && (
          <>
            <p id={titleId} className="text-sm font-semibold text-foreground">
              {t.noMatchTitle}
            </p>
            {(snapshot.detectedTrackTitle || snapshot.detectedArtist) ? (
              <p className="mt-0.5 text-xs text-muted-foreground">
                🎵 {snapshot.detectedTrackTitle}
                {snapshot.detectedArtist ? ` — ${snapshot.detectedArtist}` : ""}
                {snapshot.confidenceScore != null && snapshot.confidenceScore > 0
                  ? ` (${Math.round((snapshot.confidenceScore as number) * 100)}%)`
                  : ""}
              </p>
            ) : (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {t.noMatchDescription}
              </p>
            )}
          </>
        )}

        {matchStatus === "unlinked" && (
          <>
            <p id={titleId} className="truncate text-sm font-semibold text-foreground">
              "{snapshot.detectedTrackTitle}" — {snapshot.detectedArtist}
            </p>
            {post.linkedByUserId && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {t.unlinkedBy.replace("{user}", post.linkedByUserId)}
              </p>
            )}
            {post.unlinkReason && (
              <p className="text-xs text-muted-foreground">
                {t.unlinkedReason.replace("{reason}", post.unlinkReason)}
              </p>
            )}
          </>
        )}

        {matchStatus === "expired-before-publish" && (
          <>
            <p id={titleId} className="text-sm font-semibold text-foreground">
              {t.expiredBeforePublishTitle}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {t.expiredBeforePublishDescription}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
