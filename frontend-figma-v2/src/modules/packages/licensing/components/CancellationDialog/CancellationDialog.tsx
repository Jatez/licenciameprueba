import { useEffect, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { UseMutationResult } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/shared/components/ds/ResponsiveDialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type {
  CancelLicenseRequest,
  CancelLicenseResponse,
  CancellationReasonCategory,
  License,
} from "@/api/types";
import { formatString, licensingStrings } from "@/modules/packages/licensing/strings";
import type { CancelLicenseError } from "@/modules/packages/licensing/hooks/useCancelLicense";

interface Props {
  license: License | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cancelMutation: UseMutationResult<
    CancelLicenseResponse,
    CancelLicenseError,
    CancelLicenseRequest
  >;
}

const REASONS: CancellationReasonCategory[] = [
  "wrong-usage-type",
  "wrong-track",
  "decided-not-to-publish",
  "duplicate-license",
  "other",
];

export function CancellationDialog({
  license,
  open,
  onOpenChange,
  cancelMutation,
}: Props) {
  const t = licensingStrings.cancellationDialog;
  const [reasonCategory, setReasonCategory] =
    useState<CancellationReasonCategory | null>(null);
  const [comments, setComments] = useState("");
  const [errorCode, setErrorCode] = useState<string | null>(null);

  // Reset on open transition.
  useEffect(() => {
    if (open) {
      setReasonCategory(null);
      setComments("");
      setErrorCode(null);
    }
  }, [open, license?.id]);

  if (!license) return null;

  const usageLabel = licensingStrings.usageTypes[license.usageType].title;
  const credits = license.creditsConsumed;
  const refundCopy =
    credits === 1 ? t.refundOne : formatString(t.refundMany, { credits });
  const isPending = cancelMutation.isPending;
  const canConfirm = !!reasonCategory && !isPending;

  const handleConfirm = () => {
    if (!reasonCategory) return;
    setErrorCode(null);
    cancelMutation.mutate(
      {
        licenseId: license.id,
        reason: comments.trim(),
        reasonCategory,
      },
      {
        onSuccess: (data) => {
          const successCopy =
            data.refundedCredits === 1
              ? t.successOne
              : formatString(t.successMany, { credits: data.refundedCredits });
          toast.success(successCopy);
          onOpenChange(false);
        },
        onError: (err) => {
          setErrorCode(err.code);
        },
      },
    );
  };

  const errorMessage = errorCode
    ? (t.errors as Record<string, string>)[errorCode] ?? t.errors.NETWORK_ERROR
    : null;

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={(o) => !isPending && onOpenChange(o)}
      dismissible={!isPending}
      title={t.title}
      description={t.subtitle}
      footer={
        <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {t.cancel}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!canConfirm}
            variant="destructive"
            className="w-full sm:w-auto"
          >
            {isPending && (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            )}
            {isPending ? t.submitting : t.confirm}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-warning">
          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          {t.title}
        </div>
        <div className="rounded-lg border border-border bg-muted/40 p-3">
          <div className="font-mono text-xs text-muted-foreground">
            {license.licenseTokenId}
          </div>
          <div className="mt-0.5 text-sm font-medium text-foreground">
            {license.trackSnapshot.title} — {license.trackSnapshot.artist}
          </div>
          <div className="text-xs text-muted-foreground">
            {usageLabel} · {credits} {credits === 1 ? "crédito" : "créditos"}
          </div>
        </div>

        <p className="text-sm text-foreground">{refundCopy}</p>

        <div className="space-y-2">
          <Label className="text-sm font-medium">{t.reasonLabel}</Label>
          <RadioGroup
            value={reasonCategory ?? ""}
            onValueChange={(v) => setReasonCategory(v as CancellationReasonCategory)}
            className="gap-2"
          >
            {REASONS.map((r) => (
              <div key={r} className="flex items-center gap-2">
                <RadioGroupItem id={`cancel-reason-${r}`} value={r} />
                <Label
                  htmlFor={`cancel-reason-${r}`}
                  className="text-sm font-normal"
                >
                  {t.reasons[r]}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cancel-comments" className="text-sm font-medium">
            {t.commentsLabel}
          </Label>
          <Textarea
            id="cancel-comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder={t.commentsPlaceholder}
            rows={3}
            disabled={isPending}
          />
        </div>

        {errorMessage && (
          <Alert variant="destructive" role="alert">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
      </div>
    </ResponsiveDialog>
  );
}
