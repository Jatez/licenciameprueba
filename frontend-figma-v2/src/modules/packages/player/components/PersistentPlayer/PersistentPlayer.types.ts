import type { TrackSummary } from "@/api/types";

export interface PersistentPlayerProps {
  /** Optional className applied to the outer container. */
  className?: string;
}

export interface PlayerSubcomponentProps {
  track: TrackSummary;
}
