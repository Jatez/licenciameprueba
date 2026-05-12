import { Music } from "lucide-react";
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

interface SnapshotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: DetectedPost;
}

export function SnapshotDialog({ open, onOpenChange, post }: SnapshotDialogProps) {
  const t = trackingStrings.postCard.snapshotDialog;
  const { snapshot, platform } = post;
  const platformLabel =
    trackingStrings.syncStatus.platformLabels[platform];

  if (!snapshot) return null;
  const captured = format(new Date(snapshot.capturedAt), "PPpp", { locale: es });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>
            {t.description.replace("{platform}", platformLabel)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="aspect-square overflow-hidden rounded-md bg-foreground/[0.04]">
            {snapshot.thumbnailUrl ? (
              <img
                src={snapshot.thumbnailUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <Music size={32} aria-hidden="true" />
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            {t.capturedAt.replace("{date}", captured)}
          </p>

          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              {t.caption}
            </p>
            <p className="mt-1 text-sm text-foreground">
              {snapshot.caption || t.noCaption}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              {t.hashtags}
            </p>
            <p className="mt-1 text-sm text-foreground">
              {snapshot.hashtags.length > 0
                ? snapshot.hashtags.map((h) => `#${h}`).join(" ")
                : t.noHashtags}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>{t.close}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
