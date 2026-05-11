import { Card } from "@/components/ui/card";
import { matchTracksStrings as s } from "../strings";
import type { SpotifyPlaylistMeta } from "../types.spotify";
import { MatchSourceBadge } from "./MatchSourceBadge";

const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

interface PlaylistMetaCardProps {
  meta: SpotifyPlaylistMeta;
}

export function PlaylistMetaCard({ meta }: PlaylistMetaCardProps) {
  const labels = s.spotify.metaLabels;
  return (
    <Card className="p-6">
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Playlist</p>
          <h2 className="mt-1 text-xl font-semibold text-foreground">{meta.name}</h2>
        </div>
        <MatchSourceBadge source="spotify" />
      </header>
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <dt className="text-xs text-muted-foreground">{labels.owner}</dt>
          <dd className="text-sm font-medium text-foreground">{meta.owner}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">{labels.totalTracks}</dt>
          <dd className="text-sm font-medium tabular-nums text-foreground">{meta.totalTracks}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">{labels.duration}</dt>
          <dd className="text-sm font-medium tabular-nums text-foreground">{meta.durationLabel}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">{labels.analyzedAt}</dt>
          <dd className="text-sm font-medium text-foreground">
            {dateFormatter.format(new Date(meta.analyzedAt))}
          </dd>
        </div>
      </dl>
    </Card>
  );
}
