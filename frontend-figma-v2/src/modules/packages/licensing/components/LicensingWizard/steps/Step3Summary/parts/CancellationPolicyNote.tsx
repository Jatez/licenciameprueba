import { useState } from "react";
import { Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { licensingStrings, formatString } from "@/modules/packages/licensing/strings";
import type { CancellationPolicy } from "@/api/types";

interface Props {
  policy: CancellationPolicy | undefined;
}

export function CancellationPolicyNote({ policy }: Props) {
  const [open, setOpen] = useState(false);
  const t = licensingStrings.step3;

  if (!policy) return null;

  return (
    <>
      <Alert className="border-metric/30 bg-metric-subtle/20">
        <Info className="h-4 w-4" />
        <AlertTitle>{t.sections.cancellation}</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>{policy.policyText}</p>
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-foreground"
            onClick={() => setOpen(true)}
          >
            {t.cancellation.viewFull}
          </Button>
        </AlertDescription>
      </Alert>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.cancellation.dialogTitle}</DialogTitle>
            <DialogDescription>
              {formatString(t.cancellation.version, {
                version: policy.policyVersion,
              })}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto whitespace-pre-wrap text-sm text-foreground">
            {policy.policyText}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
