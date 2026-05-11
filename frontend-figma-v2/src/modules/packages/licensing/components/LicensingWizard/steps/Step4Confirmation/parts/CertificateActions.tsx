import { useState } from "react";
import { Download, Eye, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { License, LicensingTermsResponse } from "@/api/types";
import { licensingStrings } from "@/modules/packages/licensing/strings";
import {
  buildCertificateBlobUrl,
  downloadCertificate,
} from "@/modules/packages/licensing/utils";

interface Props {
  license: License;
  terms: LicensingTermsResponse | undefined;
}

export function CertificateActions({ license, terms }: Props) {
  const t = licensingStrings.step4.certificate;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // setTimeout to yield the loading state to React.
      await new Promise((r) => setTimeout(r, 50));
      downloadCertificate({ license, terms });
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePreview = () => {
    const url = buildCertificateBlobUrl({ license, terms });
    setPreviewUrl(url);
  };

  const closePreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  return (
    <section
      aria-label={t.title}
      className="rounded-xl border border-border bg-card p-5"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-metric-subtle/[0.63] text-metric">
          <FileText className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground">{t.title}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{t.subtitle}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          onClick={handleDownload}
          aria-label={t.downloadAria}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Download className="h-4 w-4" aria-hidden="true" />
          )}
          {isDownloading ? t.generating : t.downloadCta}
        </Button>
        <Button variant="outline" onClick={handlePreview}>
          <Eye className="h-4 w-4" aria-hidden="true" />
          {t.viewCta}
        </Button>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">{t.emailNote}</p>

      <Dialog open={!!previewUrl} onOpenChange={(o) => !o && closePreview()}>
        <DialogContent className="h-[85vh] max-w-4xl p-0">
          <DialogHeader className="border-b border-border px-6 py-4">
            <DialogTitle>{t.viewDialogTitle}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-1 flex-col">
            {previewUrl && (
              <iframe
                src={previewUrl}
                title={t.viewDialogTitle}
                className="h-full min-h-[60vh] w-full border-0"
              />
            )}
            <div className="flex justify-end gap-2 border-t border-border bg-muted/30 px-6 py-3">
              <Button onClick={handleDownload} disabled={isDownloading}>
                <Download className="h-4 w-4" aria-hidden="true" />
                {t.downloadCta}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
