import { ShieldCheck, EyeOff, AlertTriangle } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { catalogStrings } from "../strings";
import type { AdminTrack } from "../types";

interface HideTrackDialogProps {
  track: AdminTrack | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (t: AdminTrack) => void;
}

export function HideTrackDialog({ track, onOpenChange, onConfirm }: HideTrackDialogProps) {
  const open = Boolean(track);
  const isCritical = (track?.activeLicenses ?? 0) > 0;
  const t = catalogStrings.hide;
  const copy = isCritical ? t.critical : t.safe;
  const Icon = isCritical ? AlertTriangle : EyeOff;

  const handleConfirm = () => {
    if (!track) return;
    onConfirm(track);
    toast.success(t.toastHidden);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-start gap-3">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                isCritical ? "bg-error-subtle" : "bg-warning-subtle"
              } text-foreground`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="space-y-1.5 flex-1">
              <DialogTitle>{copy.title}</DialogTitle>
              <DialogDescription>{copy.body}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isCritical && (
          <div className="rounded-md border border-border bg-muted/50 p-3 space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-foreground" aria-hidden="true" />
              <Badge variant="info">{t.critical.preservesEvidence}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Licencias activas: <span className="font-medium text-foreground font-tnum">{track?.activeLicenses}</span>
            </p>
          </div>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {t.cancel}
          </Button>
          <Button variant={isCritical ? "secondary" : "default"} onClick={handleConfirm}>
            <EyeOff className="h-4 w-4" aria-hidden="true" />
            {copy.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
