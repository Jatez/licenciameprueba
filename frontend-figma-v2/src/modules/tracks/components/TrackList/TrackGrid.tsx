import type { TrackSummary } from "@/api/types";
import { TrackCard } from "../TrackCard";

interface TrackGridProps {
  tracks: TrackSummary[];
}

export function TrackGrid({ tracks }: TrackGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
      {tracks.map((t) => (
        <li key={t.id}>
          <TrackCard track={t} />
        </li>
      ))}
    </ul>
  );
}
