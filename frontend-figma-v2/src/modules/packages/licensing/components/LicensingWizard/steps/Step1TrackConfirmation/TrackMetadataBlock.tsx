import type { Track } from "@/api/types";

interface Props {
  track: Track;
}

/** Compact metadata row: album · duration · year · BPM · genre. */
export function TrackMetadataBlock({ track }: Props) {
  const minutes = Math.floor(track.durationSec / 60);
  const seconds = String(track.durationSec % 60).padStart(2, "0");
  const parts = [
    track.album,
    `${minutes}:${seconds}`,
    track.releaseYear ? String(track.releaseYear) : null,
    track.bpm ? `${track.bpm} BPM` : null,
    track.genre,
  ].filter(Boolean);
  return (
    <p className="text-sm text-muted-foreground">
      {parts.join(" · ")}
    </p>
  );
}
