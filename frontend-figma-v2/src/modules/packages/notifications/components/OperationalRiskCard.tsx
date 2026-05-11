import { useState } from "react";
import { ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { notificationsStrings } from "../strings";

export function OperationalRiskCard() {
  const [open, setOpen] = useState(false);
  const t = notificationsStrings.risk;
  const a = notificationsStrings.actions;

  return (
    <>
      <Card className="border-error-subtle/50 bg-error-subtle/15">
        <CardContent className="p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-full bg-error-subtle/40 shrink-0"
              aria-hidden="true"
            >
              <ShieldAlert size={18} className="text-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-foreground">
                {t.title}
              </h3>
              <p className="text-sm text-foreground/80 mt-0.5">
                {t.description}
              </p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
            {a.reviewRecommendation}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.modalTitle}</DialogTitle>
            <DialogDescription className="pt-2 text-foreground/80">
              {t.modalBody}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="default" onClick={() => setOpen(false)}>
              {a.close}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
