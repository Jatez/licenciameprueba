import { Eye, AlertTriangle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { LicenseStatusBadge } from "./LicenseStatusBadge";
import { licensesStrings } from "../strings";
import type { AdminLicense } from "../types";

interface Props {
  licenses: AdminLicense[];
  onSelect: (l: AdminLicense) => void;
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function LicensesTable({ licenses, onSelect }: Props) {
  const t = licensesStrings.table;

  if (licenses.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/40 px-6 py-16 text-center text-sm text-muted-foreground">
        {t.empty}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t.headers.token}</TableHead>
            <TableHead>{t.headers.track}</TableHead>
            <TableHead>{t.headers.company}</TableHead>
            <TableHead>{t.headers.usage}</TableHead>
            <TableHead className="text-right">{t.headers.credits}</TableHead>
            <TableHead>{t.headers.status}</TableHead>
            <TableHead className="whitespace-nowrap">{t.headers.issued}</TableHead>
            <TableHead className="whitespace-nowrap">{t.headers.expires}</TableHead>
            <TableHead className="text-right">{t.headers.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {licenses.map((l) => (
            <TableRow
              key={l.id}
              className="cursor-pointer hover:bg-muted/40"
              onClick={() => onSelect(l)}
            >
              <TableCell className="font-tnum text-xs text-foreground">{l.tokenId}</TableCell>
              <TableCell>
                <div className="space-y-0.5">
                  <p className="flex items-center gap-2 text-sm text-foreground">
                    {l.trackTitle}
                    {l.trackHidden && l.status === "active" && (
                      <AlertTriangle
                        className="h-3.5 w-3.5 text-warning"
                        aria-label="Track oculto"
                      />
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">{l.trackArtist}</p>
                </div>
              </TableCell>
              <TableCell className="text-sm text-foreground">{l.companyName}</TableCell>
              <TableCell className="text-sm text-foreground">
                {licensesStrings.usageType[l.usageType]}
              </TableCell>
              <TableCell className="text-right font-tnum text-sm">{l.creditsConsumed}</TableCell>
              <TableCell>
                <LicenseStatusBadge status={l.status} />
              </TableCell>
              <TableCell className="font-tnum text-xs text-muted-foreground">
                {formatDate(l.issuedAt)}
              </TableCell>
              <TableCell className="font-tnum text-xs text-muted-foreground">
                {formatDate(l.expiresAt ?? l.consumedAt)}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(l);
                  }}
                  aria-label={t.viewDetail}
                >
                  <Eye className="h-4 w-4" aria-hidden="true" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
