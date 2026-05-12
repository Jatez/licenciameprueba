import { Music2 } from "lucide-react";
import type { Track } from "@/api/types";
import { licensingStrings } from "@/modules/packages/licensing/strings";

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface Props {
  track: Track;
}

export function SummaryTrackBlock({ track }: Props) {
  const t = licensingStrings.step3.sections;
  const meta = [
    track.album,
    formatDuration(track.durationSec),
    track.releaseYear ? String(track.releaseYear) : null,
    track.genre,
  ].filter(Boolean);

  return (
    <section
      aria-label={t.track}
      className="rounded-xl border border-border bg-card p-4"
    >
      <h3 className="mb-2.5 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {t.track}
      </h3>
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
          {track.coverUrl ? (
            <img
              src={track.coverUrl}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <Music2 className="h-6 w-6" aria-hidden="true" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-foreground">
            {track.title}
          </p>
          <p className="truncate text-sm text-muted-foreground">{track.artist}</p>
          {meta.length > 0 && (
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {meta.join(" · ")}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
