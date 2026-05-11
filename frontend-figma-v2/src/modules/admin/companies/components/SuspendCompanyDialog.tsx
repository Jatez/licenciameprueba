import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { companiesStrings } from "../strings";
import type { AdminCompany } from "../types";

interface Props {
  company: AdminCompany | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => void;
}

export function SuspendCompanyDialog({ company, open, onOpenChange, onConfirm }: Props) {
  const t = companiesStrings.suspend;
  const [acknowledged, setAcknowledged] = useState(false);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!company) return null;

  const credits = company.wallet.creditsAvailable;
  const licenses = company.activeLicenses;
  const isCritical = credits > 0 || licenses > 0;

  const handleClose = (next: boolean) => {
    if (!next) {
      setAcknowledged(false);
      setReason("");
      setSubmitting(false);
    }
    onOpenChange(next);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    onConfirm(company.id);
    toast.success(t.successToast);
    handleClose(false);
  };

  const canSubmit = !isCritical || acknowledged;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>
            {isCritical ? "Revisa el impacto antes de continuar." : t.descriptionSafe}
          </DialogDescription>
        </DialogHeader>

        {isCritical && (
          <div className="space-y-3 rounded-lg border border-error/40 bg-error/10 p-4">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-error" aria-hidden="true" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-error">{t.warningTitle}</p>
                <p className="text-xs text-foreground/80">{t.warningBody}</p>
              </div>
            </div>
            <ul className="ml-7 list-disc space-y-1 text-xs text-foreground">
              {credits > 0 && <li>{t.activeCredits(credits)}</li>}
              {licenses > 0 && <li>{t.activeLicenses(licenses)}</li>}
            </ul>
            <label className="flex items-start gap-2 text-xs text-foreground">
              <Checkbox
                checked={acknowledged}
                onCheckedChange={(c) => setAcknowledged(Boolean(c))}
                className="mt-0.5"
              />
              {t.confirm}
            </label>
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="suspend-reason">{t.reasonLabel}</Label>
          <Textarea
            id="suspend-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t.reasonPlaceholder}
            rows={3}
          />
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => handleClose(false)} disabled={submitting}>
            {t.cancel}
          </Button>
          <Button variant="destructive" onClick={handleSubmit} disabled={!canSubmit || submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                {t.submitting}
              </>
            ) : (
              t.submit
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
