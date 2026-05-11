import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import type { TrackSummary } from "@/api/types";
import { usePlayerStore } from "@/stores/playerStore";
import { playerStrings } from "../../../strings";

interface PlayerExpandedSheetProps {
  open: boolean;
  track: TrackSummary;
}

/** Mobile-only expanded view. Desktop expands inline in `PersistentPlayer`. */
export function PlayerExpandedSheet({ open, track }: PlayerExpandedSheetProps) {
  const setExpanded = usePlayerStore((s) => s.setExpanded);

  return (
    <Sheet open={open} onOpenChange={(o) => setExpanded(o)}>
      <SheetContent side="bottom" className="rounded-t-card">
        <SheetHeader className="text-left">
          <SheetTitle>{playerStrings.expanded.title}</SheetTitle>
        </SheetHeader>
        <div className="mt-4 flex gap-4">
          {track.coverUrl && (
            <img
              src={track.coverUrl}
              alt=""
              className="h-24 w-24 rounded-md object-cover"
              loading="lazy"
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold text-lm-gray-900">{track.title}</p>
            <p className="truncate text-sm text-lm-gray-500">{track.artist}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="secondary">{track.genre}</Badge>
              {track.moods.slice(0, 3).map((m) => (
                <Badge key={m} variant="outline">
                  {m}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
