import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { matchTracksStrings as s } from "../strings";
import type {
  UnifiedLicenseStatus,
  UnifiedMatchRow,
  UnifiedMatchType,
} from "../types.unified";
import { MatchSourceBadge } from "./MatchSourceBadge";
import { RowCard } from "@/shared/components/ds/RowCard";

const STATUS_VARIANT: Record<
  UnifiedMatchRow["status"],
  "vigente" | "pendiente" | "expirada" | "info"
> = {
  matched: "vigente",
  partial: "pendiente",
  not_available: "expirada",
  already_licensed: "info",
};

const LICENSE_VARIANT: Record<UnifiedLicenseStatus, "vigente" | "pendiente" | "secondary"> = {
  licensed: "vigente",
  pending: "pendiente",
  not_licensed: "secondary",
};

const MATCH_TYPE_LABEL: Record<UnifiedMatchType, string> = {
  exact: "Match exacto",
  title_artist: "Título + artista",
  partial: "Parcial",
  none: "—",
  legal_review: "En revisión",
};

interface MatchResultsTableProps {
  rows: UnifiedMatchRow[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onToggleAll: (checked: boolean) => void;
  onAction: (row: UnifiedMatchRow) => void;
}

export function MatchResultsTable({
  rows,
  selectedIds,
  onToggle,
  onToggleAll,
  onAction,
}: MatchResultsTableProps) {
  const cols = s.results.columns;
  const allLicensable = rows.filter((r) => r.status === "matched");
  const allLicensableSelected =
    allLicensable.length > 0 && allLicensable.every((r) => selectedIds.includes(r.id));

  if (rows.length === 0) {
    return (
      <Card className="p-8 text-center text-sm text-muted-foreground">
        No hay tracks para los filtros seleccionados.
      </Card>
    );
  }

  return (
    <>
      {/* Mobile: stacked cards */}
      <div className="flex flex-col gap-mobile-stack md:hidden">
        {rows.map((row) => {
          const copy = s.results.statusCopy[row.status];
          return (
            <RowCard
              key={row.id}
              badge={{ text: copy.label, variant: "muted" }}
              topRight={<MatchSourceBadge source={row.source} />}
              title={row.externalTitle}
              subtitle={row.externalArtist}
              fields={[
                {
                  label: cols.matchType,
                  value: MATCH_TYPE_LABEL[row.matchType],
                },
                {
                  label: cols.confidence,
                  value: row.confidence > 0 ? `${row.confidence}%` : "—",
                },
                {
                  label: cols.credits,
                  value: row.credits != null ? row.credits : "—",
                },
                {
                  label: cols.status,
                  value: (
                    <Badge variant={LICENSE_VARIANT[row.licenseStatus]}>
                      {s.results.filters.license[row.licenseStatus]}
                    </Badge>
                  ),
                },
              ]}
              primaryAction={{
                label: copy.cta,
                onClick: () => onAction(row),
              }}
            />
          );
        })}
      </div>

      {/* Desktop: table */}
      <Card className="hidden overflow-hidden p-0 md:block">
        <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={allLicensableSelected}
                  onCheckedChange={(v) => onToggleAll(Boolean(v))}
                  aria-label="Seleccionar licenciables"
                />
              </TableHead>
              <TableHead>{cols.track}</TableHead>
              <TableHead>{cols.artist}</TableHead>
              <TableHead>{cols.source}</TableHead>
              <TableHead>{cols.catalog}</TableHead>
              <TableHead>{cols.matchType}</TableHead>
              <TableHead>{cols.confidence}</TableHead>
              <TableHead className="text-right">{cols.credits}</TableHead>
              <TableHead>{cols.status}</TableHead>
              <TableHead className="text-right">{cols.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const copy = s.results.statusCopy[row.status];
              const isSelectable = row.status === "matched";
              return (
                <TableRow key={row.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(row.id)}
                      onCheckedChange={() => onToggle(row.id)}
                      disabled={!isSelectable}
                      aria-label={`Seleccionar ${row.externalTitle}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {row.externalTitle}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{row.externalArtist}</TableCell>
                  <TableCell>
                    <MatchSourceBadge source={row.source} />
                  </TableCell>
                  <TableCell className="text-foreground">
                    {row.catalogTitle ? (
                      <div>
                        <p className="text-sm">{row.catalogTitle}</p>
                        {row.catalogVersion && (
                          <p className="text-xs text-muted-foreground">{row.catalogVersion}</p>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {MATCH_TYPE_LABEL[row.matchType]}
                  </TableCell>
                  <TableCell className="tabular-nums text-foreground">
                    {row.confidence > 0 ? `${row.confidence}%` : "—"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-foreground">
                    {row.credits != null ? row.credits : "—"}
                  </TableCell>
                  <TableCell className="space-y-1">
                    <Badge variant={STATUS_VARIANT[row.status]}>{copy.label}</Badge>
                    <div>
                      <Badge variant={LICENSE_VARIANT[row.licenseStatus]}>
                        {s.results.filters.license[
                          row.licenseStatus === "not_licensed"
                            ? "not_licensed"
                            : row.licenseStatus
                        ]}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant={row.status === "matched" ? "default" : "outline"}
                      onClick={() => onAction(row)}
                    >
                      {copy.cta}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        </div>
      </Card>
    </>
  );
}
