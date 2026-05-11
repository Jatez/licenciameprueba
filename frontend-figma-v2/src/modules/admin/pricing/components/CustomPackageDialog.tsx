import { useState } from "react";
import { Loader2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { pricingStrings } from "../strings";
import type { CustomPackageDraft } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (draft: CustomPackageDraft) => void;
}

const INITIAL: CustomPackageDraft = {
  companyName: "",
  credits: 500,
  priceCop: 130_000_000,
  validityMonths: 14,
  notes: "",
};

export function CustomPackageDialog({ open, onOpenChange, onSubmit }: Props) {
  const t = pricingStrings.custom;
  const [draft, setDraft] = useState<CustomPackageDraft>(INITIAL);
  const [submitting, setSubmitting] = useState(false);

  const handleClose = (next: boolean) => {
    if (!next) {
      setDraft(INITIAL);
      setSubmitting(false);
    }
    onOpenChange(next);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    onSubmit?.(draft);
    toast.success(t.successToast);
    handleClose(false);
  };

  const valid = draft.companyName.trim().length > 0 && draft.credits > 0 && draft.priceCop > 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="cu-company">{t.fields.companyName}</Label>
            <Input
              id="cu-company"
              value={draft.companyName}
              onChange={(e) => setDraft({ ...draft, companyName: e.target.value })}
              placeholder={t.fields.companyPlaceholder}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="cu-credits">{t.fields.credits}</Label>
              <Input
                id="cu-credits"
                type="number"
                min={1}
                value={draft.credits}
                onChange={(e) => setDraft({ ...draft, credits: Number(e.target.value) })}
                className="font-tnum"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cu-validity">{t.fields.validityMonths}</Label>
              <Input
                id="cu-validity"
                type="number"
                min={1}
                value={draft.validityMonths}
                onChange={(e) =>
                  setDraft({ ...draft, validityMonths: Number(e.target.value) })
                }
                className="font-tnum"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cu-price">{t.fields.priceCop}</Label>
            <Input
              id="cu-price"
              type="number"
              min={0}
              value={draft.priceCop}
              onChange={(e) => setDraft({ ...draft, priceCop: Number(e.target.value) })}
              className="font-tnum"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cu-notes">{t.fields.notes}</Label>
            <Textarea
              id="cu-notes"
              value={draft.notes}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              placeholder={t.fields.notesPlaceholder}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => handleClose(false)} disabled={submitting}>
            {t.cancel}
          </Button>
          <Button onClick={handleSubmit} disabled={!valid || submitting}>
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
