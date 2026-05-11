import { AlertTriangle, CheckCheck, Download, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { matchTracksStrings as s } from "../strings";

interface BulkMatchActionsProps {
  selectedCount: number;
  hasNonLicensable: boolean;
  onLicense: () => void;
  onExport: () => void;
  onAlternatives: () => void;
  onClear: () => void;
}

export function BulkMatchActions({
  selectedCount,
  hasNonLicensable,
  onLicense,
  onExport,
  onAlternatives,
  onClear,
}: BulkMatchActionsProps) {
  if (selectedCount === 0) return null;
  const c = s.results.bulk;
  return (
    <Card className="sticky top-2 z-10 flex flex-wrap items-center gap-3 border-foreground bg-foreground p-3 text-background">
      <span className="text-sm font-medium">{c.selectedCount(selectedCount)}</span>

      {hasNonLicensable && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-subtle px-2 py-1 text-xs text-foreground">
          <AlertTriangle className="h-3 w-3" aria-hidden="true" />
          {c.warningMixed}
        </span>
      )}

      <div className="ml-auto flex flex-wrap gap-2">
        <Button size="sm" variant="glass" onClick={onAlternatives}>
          <Search className="h-4 w-4" aria-hidden="true" />
          {c.alternatives}
        </Button>
        <Button size="sm" variant="glass" onClick={onExport}>
          <Download className="h-4 w-4" aria-hidden="true" />
          {c.export}
        </Button>
        <Button size="sm" onClick={onLicense}>
          <CheckCheck className="h-4 w-4" aria-hidden="true" />
          {c.license}
        </Button>
        <Button size="sm" variant="ghost" className="text-background hover:bg-background/10" onClick={onClear}>
          Cancelar
        </Button>
      </div>
    </Card>
  );
}
