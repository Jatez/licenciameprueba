import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { License, LicensingTermsResponse } from "@/api/types";
import { licensingStrings } from "@/modules/packages/licensing/strings";
import { LicenseRow } from "./LicenseRow";
import { LicenseCardMobile } from "./LicenseCardMobile";

interface Props {
  licenses: License[];
  terms: LicensingTermsResponse | undefined;
  isFetching: boolean;
  onCancel: (license: License) => void;
}

export function LicensesTable({ licenses, terms, isFetching, onCancel }: Props) {
  const t = licensingStrings.list.columns;

  return (
    <>
      {/* Mobile: stacked cards */}
      <div
        className={cn(
          "flex flex-col gap-3 md:hidden",
          isFetching && "opacity-60",
        )}
      >
        {licenses.map((l) => (
          <LicenseCardMobile
            key={l.id}
            license={l}
            terms={terms}
            onCancel={onCancel}
          />
        ))}
      </div>

      {/* Desktop: table */}
      <div
        className={cn(
          "hidden overflow-hidden rounded-xl border border-border md:block",
          isFetching && "opacity-60",
        )}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]" scope="col">
                {t.id}
              </TableHead>
              <TableHead scope="col">{t.track}</TableHead>
              <TableHead scope="col">{t.usageType}</TableHead>
              <TableHead className="text-right" scope="col">
                {t.credits}
              </TableHead>
              <TableHead scope="col">{t.issuedAt}</TableHead>
              <TableHead scope="col">{t.status}</TableHead>
              <TableHead className="w-12 sr-only" scope="col">
                {t.actions}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {licenses.map((l) => (
              <LicenseRow
                key={l.id}
                license={l}
                terms={terms}
                onCancel={onCancel}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export function LicensesTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="space-y-2 p-4">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}
