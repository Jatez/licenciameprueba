import { useNavigate } from "react-router-dom";
import { ChevronLeft, Download, Loader2, MailQuestion } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { License, LicensingTermsResponse } from "@/api/types";
import { licensingStrings } from "@/modules/packages/licensing/strings";
import { downloadCertificate } from "@/modules/packages/licensing/utils";
import { useIsCancellable } from "@/modules/packages/licensing/hooks";
import { LicenseStatusBadge } from "../LicensesListPage/LicenseStatusBadge";

interface Props {
  license: License;
  terms: LicensingTermsResponse | undefined;
  onCancelClick: () => void;
}

export function LicenseDetailHeader({ license, terms, onCancelClick }: Props) {
  const navigate = useNavigate();
  const t = licensingStrings.detail;
  const { isCancellable } = useIsCancellable(license);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await new Promise((r) => setTimeout(r, 50));
      downloadCertificate({ license, terms });
    } finally {
      setDownloading(false);
    }
  };

  const supportHref = `mailto:soporte@licenciame.co?subject=${encodeURIComponent(
    `Solicitud de anulación · ${license.licenseTokenId}`,
  )}`;

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => navigate("/licenses")}
        className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        {t.backToList}
      </button>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-mono text-2xl font-semibold tracking-tight text-foreground">
            {license.licenseTokenId}
          </h1>
          <div className="mt-2">
            <LicenseStatusBadge status={license.status} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleDownload} disabled={downloading}>
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Download className="h-4 w-4" aria-hidden="true" />
            )}
            {t.actions.downloadCertificate}
          </Button>

          {license.status === "active" &&
            (isCancellable ? (
              <Button variant="outline" onClick={onCancelClick}>
                {t.actions.cancel}
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <a href={supportHref}>
                  <MailQuestion className="h-4 w-4" aria-hidden="true" />
                  {t.actions.contactSupport}
                </a>
              </Button>
            ))}
        </div>
      </div>
    </div>
  );
}
