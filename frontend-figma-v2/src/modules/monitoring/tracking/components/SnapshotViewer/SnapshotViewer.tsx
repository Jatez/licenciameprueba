/**
 * Reusable snapshot viewer for ephemeral posts whose original link is dead.
 * Renders preserved metadata + an evidence-PDF download.
 */
import { Download, Music } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { DetectedPost } from "@/api/types";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";
import { downloadEvidencePdf } from "@/modules/monitoring/tracking/utils/generateEvidencePdf";
import { SnapshotMetadata } from "./SnapshotMetadata";

interface SnapshotViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: DetectedPost;
  /** Optional human-readable LIC-XXXX. Falls back to internal id when omitted. */
  licenseTokenId?: string;
}

export function SnapshotViewer({
  open,
  onOpenChange,
  post,
  licenseTokenId,
}: SnapshotViewerProps) {
  const t = trackingStrings.snapshotViewer;
  const platformLabel =
    trackingStrings.syncStatus.platformLabels[post.platform];
  const expiredOn =
    post.evidenceExpiresAt ?? post.snapshot.capturedAt;
  const dateText = format(new Date(expiredOn), "PPp", { locale: es });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[100dvh] overflow-y-auto sm:max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>
            {t.description
              .replace("{platform}", platformLabel)
              .replace("{date}", dateText)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="aspect-[4/5] overflow-hidden rounded-md bg-foreground/[0.04]">
            {post.snapshot.thumbnailUrl ? (
              <img
                src={post.snapshot.thumbnailUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <Music size={40} aria-hidden="true" />
              </div>
            )}
          </div>

          <SnapshotMetadata post={post} licenseTokenId={licenseTokenId} />
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {t.close}
          </Button>
          <Button onClick={() => downloadEvidencePdf({ post, licenseTokenId })}>
            <Download className="mr-2 h-4 w-4" aria-hidden="true" />
            {t.downloadEvidence}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
