import { Download, Loader2, MailQuestion } from "lucide-react";
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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <LicenseStatusBadge status={license.status} />
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
  );
}
