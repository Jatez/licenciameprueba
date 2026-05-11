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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useUnlinkPost } from "@/modules/monitoring/tracking/hooks";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";

interface UnlinkConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
  licenseId: string;
}

export function UnlinkConfirmDialog({
  open,
  onOpenChange,
  postId,
  licenseId,
}: UnlinkConfirmDialogProps) {
  const [reason, setReason] = useState("");
  const unlink = useUnlinkPost();
  const t = trackingStrings.postCard.unlinkDialog;

  const handleConfirm = () => {
    unlink.mutate(
      { postId, reason: reason.trim() || "—" },
      {
        onSuccess: () => {
          toast.success(t.successToast);
          onOpenChange(false);
          setReason("");
        },
        onError: () => toast.error(t.errorToast),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>
            {t.message.replace("{licenseId}", licenseId)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="unlink-reason">{t.reasonLabel}</Label>
          <Textarea
            id="unlink-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t.reasonPlaceholder}
            rows={3}
          />
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={unlink.isPending}
          >
            {t.cancel}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={unlink.isPending}
          >
            {unlink.isPending ? t.pending : t.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
