import type { TrackSummary } from "@/api/types";
import { TrackRow } from "../TrackRow";

interface TrackTableProps {
  tracks: TrackSummary[];
}

export function TrackTable({ tracks }: TrackTableProps) {
  return (
    <ul className="space-y-2">
      {tracks.map((t) => (
        <li key={t.id}>
          <TrackRow track={t} />
        </li>
      ))}
    </ul>
  );
}
