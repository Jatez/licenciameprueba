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
import { companiesStrings } from "../strings";
import type { AdminCompany } from "../types";

interface Props {
  company: AdminCompany | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string, credits: number, label: string) => void;
}

export function CustomPlanDialog({ company, open, onOpenChange, onConfirm }: Props) {
  const t = companiesStrings.customPlan;
  const [credits, setCredits] = useState(500);
  const [priceCop, setPriceCop] = useState(120_000_000);
  const [months, setMonths] = useState(12);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!company) return null;

  const handleClose = (next: boolean) => {
    if (!next) {
      setCredits(500);
      setPriceCop(120_000_000);
      setMonths(12);
      setNotes("");
      setSubmitting(false);
    }
    onOpenChange(next);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    const label = `Personalizado · ${credits.toLocaleString("es-CO")} créditos · ${months} meses`;
    onConfirm(company.id, credits, label);
    toast.success(t.successToast);
    handleClose(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>{t.fields.company}</Label>
            <Input value={company.name} disabled readOnly />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="cp-credits">{t.fields.credits}</Label>
              <Input
                id="cp-credits"
                type="number"
                min={1}
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                className="font-tnum"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cp-months">{t.fields.months}</Label>
              <Input
                id="cp-months"
                type="number"
                min={1}
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                className="font-tnum"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cp-price">{t.fields.priceCop}</Label>
            <Input
              id="cp-price"
              type="number"
              min={0}
              value={priceCop}
              onChange={(e) => setPriceCop(Number(e.target.value))}
              className="font-tnum"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cp-notes">{t.fields.notes}</Label>
            <Textarea
              id="cp-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => handleClose(false)} disabled={submitting}>
            {t.cancel}
          </Button>
          <Button onClick={handleSubmit} disabled={submitting || credits <= 0}>
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
