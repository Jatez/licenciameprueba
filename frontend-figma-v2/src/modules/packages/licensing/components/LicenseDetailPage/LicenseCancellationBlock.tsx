import { Clock, Lock, MailQuestion } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { License } from "@/api/types";
import { useIsCancellable } from "@/modules/packages/licensing/hooks";
import { formatString, licensingStrings } from "@/modules/packages/licensing/strings";
import { formatLicenseDate } from "@/modules/packages/licensing/utils";

interface Props {
  license: License;
  onCancelClick: () => void;
}

export function LicenseCancellationBlock({ license, onCancelClick }: Props) {
  const t = licensingStrings.detail.cancellation;
  const { isCancellable, reason, hoursRemaining } = useIsCancellable(license);

  const supportHref = `mailto:soporte@licenciame.co?subject=${encodeURIComponent(
    `Solicitud de anulación · ${license.licenseTokenId}`,
  )}`;

  if (isCancellable) {
    return (
      <Alert>
        <Clock className="h-4 w-4" aria-hidden="true" />
        <AlertTitle>
          {formatString(t.withinWindow.title, { hours: hoursRemaining })}
        </AlertTitle>
        <AlertDescription className="mt-1">
          {t.withinWindow.description}
        </AlertDescription>
        <div className="mt-3">
          <Button variant="outline" onClick={onCancelClick}>
            {t.withinWindow.cta}
          </Button>
        </div>
      </Alert>
    );
  }

  if (reason === "window-expired" && license.status === "active") {
    return (
      <Alert>
        <Lock className="h-4 w-4" aria-hidden="true" />
        <AlertTitle>{t.windowExpired.title}</AlertTitle>
        <AlertDescription className="mt-1">
          {t.windowExpired.description}
        </AlertDescription>
        <div className="mt-3">
          <Button variant="outline" asChild>
            <a href={supportHref}>
              <MailQuestion className="h-4 w-4" aria-hidden="true" />
              {t.windowExpired.cta}
            </a>
          </Button>
        </div>
      </Alert>
    );
  }

  if (reason === "already-consumed") {
    return (
      <Alert>
        <AlertDescription>
          {formatString(t.alreadyConsumed, {
            date: formatLicenseDate(license.consumedAt ?? license.issuedAt),
          })}
        </AlertDescription>
      </Alert>
    );
  }

  if (reason === "already-cancelled") {
    return (
      <Alert>
        <AlertDescription>
          {formatString(t.alreadyCancelled, {
            date: formatLicenseDate(license.cancelledAt),
            reason: license.cancellationReason ?? "—",
          })}
        </AlertDescription>
      </Alert>
    );
  }

  if (reason === "already-expired") {
    return (
      <Alert>
        <AlertDescription>
          {formatString(t.alreadyExpired, {
            date: formatLicenseDate(license.expiresAt),
          })}
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
