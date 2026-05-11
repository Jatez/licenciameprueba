import { catalogStrings } from "@/modules/tracks/strings";
import { interpolate } from "@/modules/tracks/utils";
import type { Genre, TrackSummary } from "@/api/types";
import { SimilarTrackCard } from "./SimilarTrackCard";

interface SimilarTracksProps {
  tracks: TrackSummary[];
  genre: Genre;
}

export function SimilarTracks({ tracks, genre }: SimilarTracksProps) {
  if (tracks.length === 0) return null;
  const genreLabel =
    catalogStrings.genres[genre as keyof typeof catalogStrings.genres] ?? genre;

  return (
    <section aria-labelledby="similar-tracks-title" className="space-y-4">
      <header>
        <h2 id="similar-tracks-title" className="text-lg font-semibold text-foreground">
          {catalogStrings.similarTracks.title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {interpolate(catalogStrings.similarTracks.subtitle, { genre: genreLabel })}
        </p>
      </header>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {tracks.map((t) => (
          <li key={t.id}>
            <SimilarTrackCard track={t} />
          </li>
        ))}
      </ul>
    </section>
  );
}
