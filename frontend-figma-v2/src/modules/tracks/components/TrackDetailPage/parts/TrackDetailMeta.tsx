import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { catalogStrings } from "@/modules/tracks/strings";
import { formatDuration, languageLabel } from "@/modules/tracks/utils";
import type { Track } from "@/api/types";
import { TrackDetailMetaRow } from "./TrackDetailMetaRow";
import { TrackDetailMoodsTags } from "./TrackDetailMoodsTags";

interface TrackDetailMetaProps {
  track: Track;
}

export function TrackDetailMeta({ track }: TrackDetailMetaProps) {
  const s = catalogStrings.trackDetail.metadata;
  const genreLabel =
    catalogStrings.genres[track.genre as keyof typeof catalogStrings.genres] ?? track.genre;
  const language = languageLabel(track.language);

  return (
    <section
      aria-labelledby="track-meta-title"
      className="rounded-card border border-border bg-surface p-4 sm:p-6"
    >
      <h2 id="track-meta-title" className="mb-4 text-lg font-semibold text-foreground">
        {catalogStrings.trackDetail.metaTitle}
      </h2>

      <dl className="divide-y divide-border">
        <TrackDetailMetaRow label={s.artist}>{track.artist}</TrackDetailMetaRow>
        {track.album ? (
          <TrackDetailMetaRow label={s.album}>{track.album}</TrackDetailMetaRow>
        ) : null}
        <TrackDetailMetaRow label={s.genre}>{genreLabel}</TrackDetailMetaRow>
        <TrackDetailMetaRow label={s.duration}>
          {formatDuration(track.durationSec)}
        </TrackDetailMetaRow>
        {track.releaseYear !== null ? (
          <TrackDetailMetaRow label={s.releaseYear}>{track.releaseYear}</TrackDetailMetaRow>
        ) : null}
        {track.bpm !== null ? (
          <TrackDetailMetaRow label={s.bpm}>{track.bpm}</TrackDetailMetaRow>
        ) : null}
        {language ? <TrackDetailMetaRow label={s.language}>{language}</TrackDetailMetaRow> : null}
        {track.isrc ? (
          <TrackDetailMetaRow label={s.isrc}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-help font-mono text-xs">{track.isrc}</span>
              </TooltipTrigger>
              <TooltipContent side="top">{s.isrcTooltip}</TooltipContent>
            </Tooltip>
          </TrackDetailMetaRow>
        ) : null}
      </dl>

      <div className="mt-6">
        <TrackDetailMoodsTags moods={track.moods} tags={track.tags} />
      </div>
    </section>
  );
}
