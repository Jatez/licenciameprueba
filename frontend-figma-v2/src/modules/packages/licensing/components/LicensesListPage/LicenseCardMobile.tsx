import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { License, LicensingTermsResponse } from "@/api/types";
import { licensingStrings } from "@/modules/packages/licensing/strings";
import {
  downloadCertificate,
  formatLicenseDate,
} from "@/modules/packages/licensing/utils";
import { useIsCancellable } from "@/modules/packages/licensing/hooks";
import { LicenseStatusBadge } from "./LicenseStatusBadge";
import { RowCard } from "@/shared/components/ds/RowCard";

interface Props {
  license: License;
  terms: LicensingTermsResponse | undefined;
  onCancel: (license: License) => void;
}

export function LicenseCardMobile({ license, terms, onCancel }: Props) {
  const navigate = useNavigate();
  const t = licensingStrings.list;
  const usageLabel = licensingStrings.usageTypes[license.usageType as keyof typeof licensingStrings.usageTypes]?.title ?? license.usageType;
  const { isCancellable } = useIsCancellable(license);

  return (
    <RowCard
      onClick={() => navigate(`/licenses/${license.id}`)}
      badge={{ text: license.licenseTokenId, variant: "muted" }}
      topRight={
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t.rowActions.menuLabel}
            >
              <MoreVertical className="h-4 w-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/licenses/${license.id}`)}>
              {t.rowActions.viewDetail}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => downloadCertificate({ license, terms })}
            >
              {t.rowActions.downloadCertificate}
            </DropdownMenuItem>
            {isCancellable && (
              <DropdownMenuItem
                onClick={() => onCancel(license)}
                className="text-destructive focus:text-destructive"
              >
                {t.rowActions.cancel}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      }
      title={license.trackSnapshot.title}
      subtitle={license.trackSnapshot.artist}
      fields={[
        { label: t.columns.usageType, value: usageLabel },
        {
          label: t.columns.credits,
          value: (
            <span className="tabular-nums">{license.creditsConsumed}</span>
          ),
        },
        { label: t.columns.issuedAt, value: formatLicenseDate(license.issuedAt) },
        {
          label: t.columns.status,
          value: <LicenseStatusBadge status={license.status} />,
        },
      ]}
    />
  );
}
