import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { License, TrackingErrorCode } from "@/api/types";
import { useTrackingStore } from "@/stores/trackingStore";
import { useLinkPostManually } from "@/modules/monitoring/tracking/hooks";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";
import { ManualLinkForm, type ManualLinkFormValues } from "./ManualLinkForm";
import { ManualLinkPreview } from "./ManualLinkPreview";
import { ManualLinkLicenseSelector } from "./ManualLinkLicenseSelector";
import { ManualLinkSuccess } from "./ManualLinkSuccess";

type Step = "form" | "preview" | "success";

export function ManualLinkDialog() {
  const open = useTrackingStore((s) => s.manualLinkDialogOpen);
  const close = useTrackingStore((s) => s.closeManualLinkDialog);
  const prefill = useTrackingStore((s) => s.manualLinkPrefill);
  const presetLicenseId = useTrackingStore((s) => s.manualLinkLicenseId);

  const [step, setStep] = useState<Step>("form");
  const [values, setValues] = useState<ManualLinkFormValues | null>(null);
  const [license, setLicense] = useState<License | null>(null);
  const [errorCode, setErrorCode] = useState<TrackingErrorCode | null>(null);
  const [linkedLicenseId, setLinkedLicenseId] = useState<string | null>(null);

  const linkMutation = useLinkPostManually();
  const t = trackingStrings.manualLink;

  // When opened from a "no-match" card, jump straight into preview if URL is prefilled.
  useEffect(() => {
    if (!open) return;
    if (prefill?.externalUrl && prefill.platform) {
      setValues({
        externalUrl: prefill.externalUrl,
        platform: prefill.platform,
        postType: "reel",
        publishedAt: prefill.publishedAt ?? new Date().toISOString(),
      });
      setStep("preview");
    } else {
      setStep("form");
      setValues(null);
    }
    setErrorCode(null);
    setLinkedLicenseId(null);
  }, [open, prefill]);

  const handleClose = () => {
    close();
    setTimeout(() => {
      setStep("form");
      setValues(null);
      setLicense(null);
      setErrorCode(null);
    }, 200);
  };

  const handleSubmit = () => {
    if (!values || !license) return;
    setErrorCode(null);
    linkMutation.mutate(
      {
        licenseId: license.id,
        externalUrl: values.externalUrl,
        platform: values.platform,
        postType: values.postType,
        publishedAt: values.publishedAt,
      },
      {
        onSuccess: (resp) => {
          setLinkedLicenseId(resp.license.licenseTokenId);
          setStep("success");
        },
        onError: (err) => {
          const code = (err as { code?: TrackingErrorCode })?.code ?? "NETWORK_ERROR";
          setErrorCode(code);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? handleClose() : null)}>
      <DialogContent className="max-w-2xl max-h-[100dvh] overflow-y-auto sm:max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          {step !== "success" && (
            <DialogDescription>{t.subtitle}</DialogDescription>
          )}
        </DialogHeader>

        {step === "form" && (
          <ManualLinkForm
            defaultValues={
              values ?? {
                externalUrl: prefill?.externalUrl,
                platform: prefill?.platform,
                publishedAt: prefill?.publishedAt,
              }
            }
            onValidated={(v) => {
              setValues(v);
              setStep("preview");
            }}
            onCancel={handleClose}
          />
        )}

        {step === "preview" && values && (
          <div className="space-y-4">
            <ManualLinkPreview values={values} onChange={() => setStep("form")} />

            <ManualLinkLicenseSelector
              selectedLicenseId={license?.id ?? presetLicenseId ?? null}
              onSelect={(l) => setLicense(l)}
            />

            {errorCode && (
              <Alert variant="destructive">
                <AlertDescription>{t.errors[errorCode]}</AlertDescription>
              </Alert>
            )}

            <p className="text-xs text-muted-foreground">{t.impactNotice}</p>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                onClick={() => setStep("form")}
                disabled={linkMutation.isPending}
              >
                {t.backBtn}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!license || linkMutation.isPending}
              >
                {linkMutation.isPending ? t.submitPending : t.submitBtn}
              </Button>
            </div>
          </div>
        )}

        {step === "success" && linkedLicenseId && (
          <ManualLinkSuccess
            licenseId={linkedLicenseId}
            onLinkAnother={() => {
              setStep("form");
              setValues(null);
              setLicense(null);
              setLinkedLicenseId(null);
            }}
            onClose={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
