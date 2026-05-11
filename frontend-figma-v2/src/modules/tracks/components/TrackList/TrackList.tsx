import { cn } from "@/lib/utils";
import type { TrackSummary } from "@/api/types";
import type { CatalogViewMode } from "@/stores/catalogStore";
import { TrackGrid } from "./TrackGrid";
import { TrackTable } from "./TrackTable";

interface TrackListProps {
  tracks: TrackSummary[];
  viewMode: CatalogViewMode;
  isFetching: boolean;
}

export function TrackList({ tracks, viewMode, isFetching }: TrackListProps) {
  return (
    <div
      className={cn(
        "transition-opacity",
        isFetching && "pointer-events-none opacity-60",
      )}
      aria-busy={isFetching}
    >
      {viewMode === "grid" ? <TrackGrid tracks={tracks} /> : <TrackTable tracks={tracks} />}
    </div>
  );
}
