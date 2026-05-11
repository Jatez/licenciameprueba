import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import type { License, LicensingTermsResponse } from "@/api/types";
import { licensingStrings } from "@/modules/packages/licensing/strings";
import {
  downloadCertificate,
  formatLicenseDate,
} from "@/modules/packages/licensing/utils";
import { useIsCancellable } from "@/modules/packages/licensing/hooks";
import { LicenseStatusBadge } from "./LicenseStatusBadge";

interface Props {
  license: License;
  terms: LicensingTermsResponse | undefined;
  onCancel: (license: License) => void;
}

export function LicenseRow({ license, terms, onCancel }: Props) {
  const navigate = useNavigate();
  const t = licensingStrings.list;
  const usageLabel = licensingStrings.usageTypes[license.usageType as keyof typeof licensingStrings.usageTypes]?.title ?? license.usageType;
  const { isCancellable } = useIsCancellable(license);

  const goToDetail = () => navigate(`/licenses/${license.id}`);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTableRowElement>) => {
    if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) {
      e.preventDefault();
      goToDetail();
    }
  };

  return (
    <TableRow
      role="button"
      tabIndex={0}
      onClick={goToDetail}
      onKeyDown={handleKeyDown}
      className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <TableCell className="font-mono text-xs text-muted-foreground">
        {license.licenseTokenId}
      </TableCell>
      <TableCell>
        <div className="font-medium text-foreground">
          {license.trackSnapshot.title}
        </div>
        <div className="text-xs text-muted-foreground">
          {license.trackSnapshot.artist}
        </div>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {usageLabel}
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {license.creditsConsumed}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {formatLicenseDate(license.issuedAt)}
      </TableCell>
      <TableCell>
        <LicenseStatusBadge status={license.status} />
      </TableCell>
      <TableCell
        className="w-12"
        onClick={(e) => e.stopPropagation()}
      >
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
            <DropdownMenuItem onClick={goToDetail}>
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
      </TableCell>
    </TableRow>
  );
}
