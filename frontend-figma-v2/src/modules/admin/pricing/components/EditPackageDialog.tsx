import { useEffect, useState } from "react";
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
import type { PricingPackage } from "../types";

interface Props {
  pkg: PricingPackage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (pkg: PricingPackage) => void;
}

export function EditPackageDialog({ pkg, open, onOpenChange, onSave }: Props) {
  const t = pricingStrings.edit;
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [priceCop, setPriceCop] = useState(0);
  const [credits, setCredits] = useState(0);
  const [validityMonths, setValidityMonths] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (pkg) {
      setName(pkg.name);
      setTagline(pkg.tagline);
      setPriceCop(pkg.priceCop);
      setCredits(pkg.credits);
      setValidityMonths(pkg.validityMonths);
    }
  }, [pkg]);

  if (!pkg) return null;

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    onSave({
      ...pkg,
      name,
      tagline,
      priceCop,
      credits,
      validityMonths,
      pricePerCreditCop: credits > 0 ? Math.round(priceCop / credits) : 0,
    });
    toast.success(t.successToast);
    setSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t.title} · {pkg.name}
          </DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="ep-name">{t.fields.name}</Label>
            <Input id="ep-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ep-tagline">{t.fields.tagline}</Label>
            <Textarea
              id="ep-tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ep-credits">{t.fields.credits}</Label>
              <Input
                id="ep-credits"
                type="number"
                min={1}
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                className="font-tnum"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ep-validity">{t.fields.validityMonths}</Label>
              <Input
                id="ep-validity"
                type="number"
                min={1}
                value={validityMonths}
                onChange={(e) => setValidityMonths(Number(e.target.value))}
                className="font-tnum"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ep-price">{t.fields.priceCop}</Label>
            <Input
              id="ep-price"
              type="number"
              min={0}
              value={priceCop}
              onChange={(e) => setPriceCop(Number(e.target.value))}
              className="font-tnum"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={submitting}>
            {t.cancel}
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
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
