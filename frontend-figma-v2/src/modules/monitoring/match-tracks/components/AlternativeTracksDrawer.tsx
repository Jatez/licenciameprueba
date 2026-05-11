import { Music2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { alternativeTracks } from "../mocks.unified";
import { matchTracksStrings as s } from "../strings";
import type { AlternativeTrack, UnifiedMatchRow } from "../types.unified";

interface AlternativeTracksDrawerProps {
  row: UnifiedMatchRow | null;
  onClose: () => void;
  onLicense: (alt: AlternativeTrack) => void;
}

export function AlternativeTracksDrawer({
  row,
  onClose,
  onLicense,
}: AlternativeTracksDrawerProps) {
  const c = s.results.alternativesDrawer;
  const open = row !== null;
  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{c.title}</SheetTitle>
          <SheetDescription>{c.subtitle}</SheetDescription>
        </SheetHeader>

        {row && (
          <p className="mt-3 text-xs text-muted-foreground">
            Track original: <span className="text-foreground">{row.externalTitle}</span> ·{" "}
            {row.externalArtist}
          </p>
        )}

        <ul className="mt-5 space-y-3">
          {alternativeTracks.map((alt) => (
            <li key={alt.id}>
              <Card className="flex items-center gap-4 p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-lm-gray-100 text-foreground">
                  <Music2 className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{alt.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {alt.artist} · {alt.mood}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Créditos</p>
                  <p className="text-sm font-semibold tabular-nums text-foreground">
                    {alt.credits}
                  </p>
                </div>
                <Button size="sm" onClick={() => onLicense(alt)}>
                  {c.cta}
                </Button>
              </Card>
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
