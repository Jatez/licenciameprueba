import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { matchTracksStrings as s } from "../strings";
import type { UnifiedMatchRow } from "../types.unified";
import { MatchSourceBadge } from "./MatchSourceBadge";

interface LicenseTrackModalProps {
  row: UnifiedMatchRow | null;
  onClose: () => void;
  onConfirm: (row: UnifiedMatchRow) => void;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-2 last:border-0">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  );
}

export function LicenseTrackModal({ row, onClose, onConfirm }: LicenseTrackModalProps) {
  const c = s.results.licenseModal;
  const open = row !== null;
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{c.title}</DialogTitle>
          <DialogDescription>
            Licenciamiento simulado. No se consumen créditos reales.
          </DialogDescription>
        </DialogHeader>

        {row && (
          <div className="mt-2">
            <Row label={c.track} value={row.externalTitle} />
            <Row label={c.artist} value={row.externalArtist} />
            <Row
              label={c.credits}
              value={row.credits != null ? `${row.credits} créditos` : "—"}
            />
            <Row label={c.usage} value={c.defaults.usage} />
            <Row label={c.company} value={c.defaults.company} />
            <Row label={c.detectedSource} value={<MatchSourceBadge source={row.source} />} />
            <Row
              label={c.licenseStatus}
              value={<Badge variant="secondary">{c.defaults.licenseStatus}</Badge>}
            />
          </div>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            {c.cancel}
          </Button>
          <Button onClick={() => row && onConfirm(row)}>{c.confirm}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
