import { Pencil, EyeOff, RotateCcw } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TrackStatusBadge } from "./TrackStatusBadge";
import { catalogStrings } from "../strings";
import type { AdminTrack } from "../types";

interface TrackDetailSheetProps {
  track: AdminTrack | null;
  onOpenChange: (open: boolean) => void;
  onEdit: (t: AdminTrack) => void;
  onHide: (t: AdminTrack) => void;
  onRestore: (t: AdminTrack) => void;
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("es-CO", { day: "2-digit", month: "long", year: "numeric" }).format(
      new Date(iso),
    );
  } catch {
    return iso;
  }
}

export function TrackDetailSheet({
  track,
  onOpenChange,
  onEdit,
  onHide,
  onRestore,
}: TrackDetailSheetProps) {
  const open = Boolean(track);
  const t = catalogStrings.detail;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl overflow-y-auto"
        aria-describedby="track-detail-description"
      >
        {track && (
          <>
            <SheetHeader>
              <SheetTitle>{t.title}</SheetTitle>
              <SheetDescription id="track-detail-description">{t.description}</SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">{track.title}</h3>
                <p className="text-sm text-muted-foreground">{track.artist}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <TrackStatusBadge status={track.status} />
                  <span className="text-xs text-muted-foreground font-tnum">{track.isrc}</span>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <Field label={t.fields.genre} value={track.genre} />
                <Field label={t.fields.mood} value={track.mood} />
                <Field label={t.fields.duration} value={formatDuration(track.durationSeconds)} />
                <Field label={t.fields.credits} value={track.creditsRequired} />
                <Field label={t.fields.activeLicenses} value={track.activeLicenses.toLocaleString("es-CO")} />
                <Field label={t.fields.uploadedAt} value={formatDate(track.uploadedAt)} />
                <Field label={t.fields.updatedAt} value={formatDate(track.updatedAt)} />
                <Field label={t.fields.isrc} value={track.isrc} />
              </div>

              <Field label={t.fields.recommendedUse} value={track.recommendedUse} />
              <Field label={t.fields.legalNotes} value={track.legalNotes} />

              <Separator />

              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">{t.licensees.title}</p>
                {track.licensees.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t.licensees.empty}</p>
                ) : (
                  <ul className="space-y-2">
                    {track.licensees.map((l) => (
                      <li
                        key={l.companyId}
                        className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2"
                      >
                        <span className="text-sm text-foreground">{l.companyName}</span>
                        <span className="text-xs font-medium text-muted-foreground font-tnum">
                          {t.licensees.licensesUnit(l.licenses)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <Button variant="secondary" onClick={() => onEdit(track)}>
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  {t.actions.edit}
                </Button>
                {track.status === "hidden" ? (
                  <Button variant="ghost" onClick={() => onRestore(track)}>
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    {t.actions.restore}
                  </Button>
                ) : (
                  <Button variant="ghost" onClick={() => onHide(track)}>
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                    {t.actions.hide}
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
