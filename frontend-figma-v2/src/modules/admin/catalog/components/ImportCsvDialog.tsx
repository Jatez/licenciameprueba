import { useState } from "react";
import { toast } from "sonner";
import { UploadCloud, FileSpreadsheet, AlertTriangle, CheckCircle2 } from "lucide-react";
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

type Step = "upload" | "preview" | "result";

interface ImportCsvDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function Stepper({ current }: { current: Step }) {
  const labels = catalogStrings.importExport.steps;
  const order: Step[] = ["upload", "preview", "result"];
  return (
    <ol className="flex items-center gap-2 text-xs font-medium">
      {order.map((s, i) => {
        const active = s === current;
        const done = order.indexOf(current) > i;
        return (
          <li key={s} className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${
                done
                  ? "bg-foreground text-background"
                  : active
                    ? "bg-primary text-foreground"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {i + 1}
            </span>
            <span className={active ? "text-foreground" : "text-muted-foreground"}>{labels[s]}</span>
            {i < order.length - 1 && <span className="text-muted-foreground">·</span>}
          </li>
        );
      })}
    </ol>
  );
}

export function ImportCsvDialog({ open, onOpenChange }: ImportCsvDialogProps) {
  const t = catalogStrings.importExport;
  const [step, setStep] = useState<Step>("upload");
  const [fileName, setFileName] = useState<string | null>(null);

  const handleClose = (next: boolean) => {
    onOpenChange(next);
    if (!next) {
      setStep("upload");
      setFileName(null);
    }
  };

  const handleSelectMockFile = () => setFileName(t.upload.mock);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>

        <Stepper current={step} />

        {step === "upload" && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleSelectMockFile}
              className="flex w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-muted/30 p-10 text-center transition-colors hover:border-primary hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-foreground">
                <UploadCloud className="h-6 w-6" aria-hidden="true" />
              </span>
              <span className="text-sm font-medium text-foreground">{t.upload.dropzone}</span>
              <span className="text-xs text-muted-foreground">{t.upload.hint}</span>
              <Badge variant="secondary">{t.upload.cta}</Badge>
            </button>
            {fileName && (
              <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2">
                <FileSpreadsheet className="h-4 w-4 text-foreground" aria-hidden="true" />
                <span className="text-sm text-foreground">{fileName}</span>
              </div>
            )}
            <button
              type="button"
              className="text-xs text-muted-foreground underline-offset-2 hover:underline"
              onClick={() => toast(t.export.toast)}
            >
              {t.upload.template}
            </button>
            <DialogFooter>
              <Button variant="ghost" onClick={() => handleClose(false)}>{catalogStrings.hide.cancel}</Button>
              <Button disabled={!fileName} onClick={() => setStep("preview")}>{t.upload.next}</Button>
            </DialogFooter>
          </div>
        )}

        {step === "preview" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <PreviewStat label={t.preview.newTracks} value="240" />
              <PreviewStat label={t.preview.updates} value="1.120" />
              <PreviewStat label={t.preview.errors} value="18" tone="warn" />
              <PreviewStat label={t.preview.conflicts} value="3" tone="danger" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">{t.preview.issuesTitle}</p>
              <ul className="space-y-2">
                <IssueRow text={t.preview.issues.missingColumns} />
                <IssueRow text={t.preview.issues.duplicates} />
                <IssueRow text={t.preview.issues.legalConflicts} severe />
              </ul>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setStep("upload")}>{t.preview.back}</Button>
              <Button onClick={() => { setStep("result"); toast.success(t.export.toast); }}>
                {t.preview.confirm}
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === "result" && (
          <div className="space-y-4 text-center py-6">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success-subtle text-foreground">
              <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
            </span>
            <div className="space-y-1">
              <p className="text-base font-semibold text-foreground">{t.result.successTitle}</p>
              <p className="text-sm text-muted-foreground">{t.result.successBody}</p>
            </div>
            <DialogFooter className="sm:justify-center">
              <Button onClick={() => handleClose(false)}>{t.result.close}</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function PreviewStat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "warn" | "danger";
}) {
  return (
    <div className="rounded-md border border-border bg-card p-3 space-y-1">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold font-tnum text-foreground">{value}</p>
      {tone === "warn" && <Badge variant="pendiente">Revisar</Badge>}
      {tone === "danger" && <Badge variant="expirada">Crítico</Badge>}
    </div>
  );
}

function IssueRow({ text, severe }: { text: string; severe?: boolean }) {
  return (
    <li className={`flex items-start gap-2 rounded-md border px-3 py-2 text-sm ${
      severe ? "border-error/30 bg-error-subtle/40" : "border-border bg-muted/40"
    }`}>
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-foreground" aria-hidden="true" />
      <span className="text-foreground">{text}</span>
    </li>
  );
}
