import { TrackTableHeader } from "./parts/TrackTableHeader";
import { TrackTableRow } from "./parts/TrackTableRow";
import type { TrackTableProps } from "./TrackTable.types";

/**
 * TrackTable — standard track listing table.
 * - Shell: bg-white, border lm-gray-200, rounded-lg
 * - Header row + N TrackTableRow
 * - Columns: cover · play · title+artist · BPM · duration · waveform (lg+) · actions · CTA
 */
export function TrackTable({
  tracks,
  onLicense,
  onPlay,
  onDownload,
  onFavorite,
  onMore,
}: TrackTableProps) {
  return (
    <div className="bg-white border border-lm-gray-200 rounded-lg overflow-hidden">
      <TrackTableHeader />
      {tracks.map((track) => (
        <TrackTableRow
          key={track.id}
          track={track}
          onLicense={onLicense}
          onPlay={onPlay}
          onDownload={onDownload}
          onFavorite={onFavorite}
          onMore={onMore}
        />
      ))}
    </div>
  );
}
