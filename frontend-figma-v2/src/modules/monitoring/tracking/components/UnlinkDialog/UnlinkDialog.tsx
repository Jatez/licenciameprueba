/**
 * Refined unlink dialog (F-06 Prompt 3).
 * Required reason (radio) + optional comment + ephemeral-preserved guard.
 */
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Music } from "lucide-react";
import type { DetectedPost } from "@/api/types";
import { useUnlinkPost } from "@/modules/monitoring/tracking/hooks";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";

type UnlinkReasonId = "wrong-license" | "post-deleted" | "wrong-match" | "other";

interface UnlinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: DetectedPost;
  /** Display id (LIC-XXXX). Falls back to post.licenseId when absent. */
  licenseTokenId?: string;
}

export function UnlinkDialog({
  open,
  onOpenChange,
  post,
  licenseTokenId,
}: UnlinkDialogProps) {
  const t = trackingStrings.unlinkDialog;
  const [reasonId, setReasonId] = useState<UnlinkReasonId | "">("");
  const [comments, setComments] = useState("");
  const unlink = useUnlinkPost();

  const isPreserved = post.evidenceStatus === "ephemeral-preserved";
  const displayId = licenseTokenId ?? post.licenseId ?? "—";

  const handleConfirm = () => {
    if (!reasonId || isPreserved) return;
    const reasonLabel = t.reasons[reasonId];
    const fullReason = comments.trim() ? `${reasonLabel} — ${comments.trim()}` : reasonLabel;
    unlink.mutate(
      { postId: post.id, reason: fullReason },
      {
        onSuccess: () => {
          toast.success(t.success.replace("{licenseId}", displayId));
          onOpenChange(false);
          setReasonId("");
          setComments("");
        },
        onError: () => toast.error(t.error.generic),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[100dvh] overflow-y-auto sm:max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.subtitle}</DialogDescription>
        </DialogHeader>

        <Card className="flex items-center gap-3 p-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-foreground/[0.04]">
            {post.snapshot.thumbnailUrl ? (
              <img
                src={post.snapshot.thumbnailUrl}
                alt=""
                className="h-full w-full rounded-md object-cover"
              />
            ) : (
              <Music size={20} className="text-muted-foreground" aria-hidden="true" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              "{post.snapshot.detectedTrackTitle}" — {post.snapshot.detectedArtist}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {trackingStrings.postCard.associatedTo
                .replace("{licenseId}", displayId)
                .replace(" ({usageType})", "")}
            </p>
          </div>
        </Card>

        {isPreserved ? (
          <Alert variant="destructive">
            <AlertDescription>{t.error.ephemeralPreserved}</AlertDescription>
          </Alert>
        ) : (
          <>
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">{t.impactTitle}</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• {t.impacts.backToActive.replace("{licenseId}", displayId)}</li>
                <li>• {t.impacts.canRelink}</li>
                <li>• {t.impacts.auditTrail}</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label>{t.reasonLabel}</Label>
              <RadioGroup
                value={reasonId}
                onValueChange={(v) => setReasonId(v as UnlinkReasonId)}
              >
                {(Object.keys(t.reasons) as UnlinkReasonId[]).map((id) => (
                  <label
                    key={id}
                    htmlFor={`unlink-reason-${id}`}
                    className="flex cursor-pointer items-center gap-2 rounded-md p-2 text-sm hover:bg-foreground/[0.02]"
                  >
                    <RadioGroupItem id={`unlink-reason-${id}`} value={id} />
                    <span>{t.reasons[id]}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unlink-comments">{t.commentsLabel}</Label>
              <Textarea
                id="unlink-comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder={t.commentsPlaceholder}
                rows={3}
              />
            </div>
          </>
        )}

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={unlink.isPending}
          >
            {t.cancel}
          </Button>
          {!isPreserved && (
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={!reasonId || unlink.isPending}
            >
              {unlink.isPending ? t.submitting : t.confirm}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
