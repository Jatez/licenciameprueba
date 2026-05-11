import { AlertTriangle } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { matchTracksStrings as s } from "../strings";
import type { UnifiedMatchRow } from "../types.unified";
import { MatchSourceBadge } from "./MatchSourceBadge";

interface PartialMatchDrawerProps {
  row: UnifiedMatchRow | null;
  onClose: () => void;
  onConfirm: (row: UnifiedMatchRow) => void;
  onFindOther: (row: UnifiedMatchRow) => void;
  onMarkUnavailable: (row: UnifiedMatchRow) => void;
}

function Field({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm text-foreground">{value ?? "—"}</dd>
    </div>
  );
}

export function PartialMatchDrawer({
  row,
  onClose,
  onConfirm,
  onFindOther,
  onMarkUnavailable,
}: PartialMatchDrawerProps) {
  const c = s.results.partialDrawer;
  const open = row !== null;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-3xl">
        <SheetHeader>
          <SheetTitle>{c.title}</SheetTitle>
          <SheetDescription>
            Compara metadata externa con la entrada del catálogo Licénciame.
          </SheetDescription>
        </SheetHeader>

        {row && (
          <div className="mt-6 space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {c.detected}
                </p>
                <dl className="mt-3 space-y-3">
                  <Field label={c.fields.name} value={row.externalTitle} />
                  <Field label={c.fields.artist} value={row.externalArtist} />
                  <Field label={c.fields.album} value={row.externalAlbum} />
                  <Field
                    label={c.fields.source}
                    value={<MatchSourceBadge source={row.source} />}
                  />
                  <Field label={c.fields.duration} value={row.externalDuration} />
                  <Field label={c.fields.metadata} value={row.externalMetadata} />
                </dl>
              </Card>
              <Card className="border-primary p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
                  {c.catalog}
                </p>
                <dl className="mt-3 space-y-3">
                  <Field label={c.fields.name} value={row.catalogTitle} />
                  <Field label={c.fields.artist} value={row.catalogArtist} />
                  <Field label={c.fields.version} value={row.catalogVersion} />
                  <Field label={c.fields.duration} value={row.catalogDuration} />
                  <Field
                    label={c.fields.credits}
                    value={row.credits != null ? `${row.credits} créditos` : undefined}
                  />
                  <Field label={c.fields.legal} value={row.legalNote ?? "Sin observaciones"} />
                  <Field label={c.fields.confidence} value={`${row.confidence}%`} />
                </dl>
              </Card>
            </div>

            <Card className="flex items-start gap-3 border-warning bg-warning-subtle p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-foreground" aria-hidden="true" />
              <p className="text-sm text-foreground">{c.alert}</p>
            </Card>

            <div className="flex flex-wrap justify-end gap-2">
              <Button variant="ghost" onClick={() => onMarkUnavailable(row)}>
                {c.markUnavailable}
              </Button>
              <Button variant="outline" onClick={() => onFindOther(row)}>
                {c.findOther}
              </Button>
              <Button onClick={() => onConfirm(row)}>{c.confirm}</Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
