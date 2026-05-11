/**
 * F-11 · Top tracks rich section.
 *
 * - Top 3 podium cards with cover, position-change indicator, mini platform bar.
 * - Compact rows for ranks 4-N.
 * - Sort selector reorders ranking in real time.
 * - Click on a track activates the table filter (controlled from parent).
 *
 * Data flow: parent owns `sortKey` so the URL/state is single-sourced.
 * Click navigation is delegated via `onSelectTrack` (parent scrolls table + sets filter).
 */
import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, Minus, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { formatCompactNumber } from "@/shared/format";
import type { MetricsTopTrack, SocialPlatform } from "../types";
import type { TopTrackSortKey } from "../selectors/computeTopTracks";
import { metricsStrings, platformLabels } from "../strings";
import { interpolateString } from "../utils";

interface TopTracksSectionProps {
  tracks: MetricsTopTrack[] | null;
  /** Previous-period ranking (same sortKey). Used to compute position changes. */
  previousTracks: MetricsTopTrack[] | null;
  isLoading: boolean;
  sortKey: TopTrackSortKey;
  onSortChange: (key: TopTrackSortKey) => void;
  /** Active trackId filter on the publications table (or null). */
  activeTrackId: string | null;
  onSelectTrack: (trackId: string, title: string) => void;
}

const PLATFORM_ORDER: SocialPlatform[] = ["instagram", "tiktok", "facebook"];

const PLATFORM_INITIALS: Record<SocialPlatform, string> = {
  instagram: "IG",
  tiktok: "TT",
  facebook: "FB",
};

/** Returns position delta vs previous period: positive = climbed; null = new. */
function positionDelta(
  trackId: string,
  currentRank: number,
  previous: MetricsTopTrack[] | null,
): number | null {
  if (!previous) return 0;
  const prev = previous.find((t) => t.trackId === trackId);
  if (!prev) return null;
  return prev.rank - currentRank;
}

function metricLabel(sortKey: TopTrackSortKey): string {
  switch (sortKey) {
    case "interactions":
      return metricsStrings.topTracks.metricInteractions;
    case "engagement":
      return metricsStrings.topTracks.metricEngagement;
    case "publications":
      return metricsStrings.topTracks.metricPublications;
    default:
      return metricsStrings.topTracks.metricViews;
  }
}

function formatMetricValue(track: MetricsTopTrack, sortKey: TopTrackSortKey): string {
  switch (sortKey) {
    case "interactions":
      return formatCompactNumber(track.totalInteractions);
    case "engagement":
      return `${track.engagementRate.toFixed(1)}%`;
    case "publications":
      return formatCompactNumber(track.totalPublications);
    default:
      return formatCompactNumber(track.totalViews);
  }
}

function PositionChange({ delta }: { delta: number | null }) {
  if (delta === null) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-foreground">
        <Sparkles className="h-3 w-3" aria-hidden="true" />
        {metricsStrings.topTracks.podiumNew}
      </span>
    );
  }
  if (delta === 0) {
    return (
      <span
        className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground/50"
        title={metricsStrings.topTracks.posSame}
      >
        <Minus className="h-3 w-3" aria-hidden="true" />
        0
      </span>
    );
  }
  if (delta > 0) {
    return (
      <span
        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400"
        title={interpolateString(metricsStrings.topTracks.posUp, { n: delta })}
      >
        <ChevronUp className="h-3 w-3" aria-hidden="true" />
        {delta}
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400"
      title={interpolateString(metricsStrings.topTracks.posDown, { n: Math.abs(delta) })}
    >
      <ChevronDown className="h-3 w-3" aria-hidden="true" />
      {Math.abs(delta)}
    </span>
  );
}

function PlatformBar({ byPlatform }: { byPlatform: Record<SocialPlatform, number> }) {
  const total = PLATFORM_ORDER.reduce((acc, p) => acc + byPlatform[p], 0);
  if (total === 0) return null;
  return (
    <div className="mt-2 flex items-center gap-1.5">
      <div className="flex h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/5">
        {PLATFORM_ORDER.map((p) => {
          const pct = (byPlatform[p] / total) * 100;
          if (pct === 0) return null;
          return (
            <div
              key={p}
              className={cn(
                "h-full",
                p === "instagram" && "bg-foreground/80",
                p === "tiktok" && "bg-foreground/55",
                p === "facebook" && "bg-foreground/30",
              )}
              style={{ width: `${pct}%` }}
              aria-label={`${platformLabels[p]} ${pct.toFixed(0)}%`}
            />
          );
        })}
      </div>
      <div className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-foreground/50">
        {PLATFORM_ORDER.filter((p) => byPlatform[p] > 0).map((p) => (
          <span key={p} aria-label={platformLabels[p]}>{PLATFORM_INITIALS[p]}</span>
        ))}
      </div>
    </div>
  );
}

function PodiumCard({
  track,
  delta,
  sortKey,
  isActive,
  onSelect,
}: {
  track: MetricsTopTrack;
  delta: number | null;
  sortKey: TopTrackSortKey;
  isActive: boolean;
  onSelect: () => void;
}) {
  const secondaryLabel =
    sortKey === "views"
      ? `${formatCompactNumber(track.totalInteractions)} ${metricsStrings.topTracks.metricInteractions}`
      : `${formatCompactNumber(track.totalViews)} ${metricsStrings.topTracks.metricViews}`;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group flex flex-col gap-3 rounded-xl border p-4 text-left transition-colors",
        "border-foreground/5 bg-background/50 hover:border-foreground/15 hover:bg-foreground/[0.02]",
        isActive && "border-primary/60 bg-primary/5 hover:border-primary",
      )}
      aria-pressed={isActive}
    >
      <div className="flex items-start gap-3">
        <img
          src={track.trackCoverUrl}
          alt=""
          loading="lazy"
          className="h-20 w-20 shrink-0 rounded-lg object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="font-tnum inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-foreground"
              aria-label={`Posición ${track.rank}`}
            >
              {track.rank}
            </span>
            <p className="truncate text-sm font-semibold text-foreground">{track.trackTitle}</p>
          </div>
          <p className="mt-0.5 truncate text-xs text-foreground/60">{track.trackArtist}</p>
          <div className="mt-2">
            <PositionChange delta={delta} />
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="font-tnum text-2xl font-bold leading-none text-foreground">
            {formatMetricValue(track, sortKey)}
          </p>
          <p className="mt-1 text-[11px] uppercase tracking-wide text-foreground/50">
            {metricLabel(sortKey)}
          </p>
        </div>
        <p className="font-tnum text-[11px] text-foreground/60">{secondaryLabel}</p>
      </div>

      <PlatformBar byPlatform={track.byPlatform} />
    </button>
  );
}

function CompactRow({
  track,
  delta,
  sortKey,
  isActive,
  onSelect,
}: {
  track: MetricsTopTrack;
  delta: number | null;
  sortKey: TopTrackSortKey;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-left transition-colors hover:bg-foreground/[0.03]",
          isActive && "border-primary/40 bg-primary/5",
        )}
        aria-pressed={isActive}
      >
        <span className="font-tnum w-7 text-center text-xs font-semibold text-foreground/60">
          #{track.rank}
        </span>
        <img
          src={track.trackCoverUrl}
          alt=""
          loading="lazy"
          className="h-10 w-10 shrink-0 rounded-md object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{track.trackTitle}</p>
          <p className="truncate text-xs text-foreground/60">{track.trackArtist}</p>
        </div>
        <div className="hidden shrink-0 items-center gap-4 sm:flex">
          <span className="font-tnum text-xs text-foreground/70">
            {track.totalPublications} {metricsStrings.topTracks.publicationsShort}
          </span>
          <span className="font-tnum text-xs text-foreground/70">
            {formatMetricValue(track, sortKey)}
          </span>
          <span className="font-tnum w-12 text-right text-xs text-foreground/70">
            {track.engagementRate.toFixed(1)}%
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-foreground/50">
          {PLATFORM_ORDER.filter((p) => track.byPlatform[p] > 0).map((p) => (
            <span key={p}>{PLATFORM_INITIALS[p]}</span>
          ))}
        </div>
        <div className="ml-2 shrink-0">
          <PositionChange delta={delta} />
        </div>
      </button>
    </li>
  );
}

export function TopTracksSection({
  tracks,
  previousTracks,
  isLoading,
  sortKey,
  onSortChange,
  activeTrackId,
  onSelectTrack,
}: TopTracksSectionProps) {
  const [showAllOpen, setShowAllOpen] = useState(false);

  const list = tracks ?? [];
  const podium = list.slice(0, 3);
  const rest = list.slice(3, 12);

  const showPodium = !isLoading && podium.length >= 3;
  const showCompactOnly = !isLoading && podium.length > 0 && podium.length < 3;

  const sortOptions: TopTrackSortKey[] = ["views", "interactions", "engagement", "publications"];

  const memoizedDeltas = useMemo(() => {
    const map = new Map<string, number | null>();
    for (const t of list) map.set(t.trackId, positionDelta(t.trackId, t.rank, previousTracks));
    return map;
  }, [list, previousTracks]);

  // Hide section entirely when no tracks at all (after load).
  if (!isLoading && list.length === 0) return null;

  return (
    <Card id="top-tracks" className="flex flex-col gap-4 p-4 md:p-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-mobile-stack-lg">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-base font-semibold text-foreground">
            {metricsStrings.topTracks.title}
          </h3>
          {activeTrackId && tracks && (
            <p className="text-xs text-foreground/60">
              {metricsStrings.topTracks.activeFilterLabel}{" "}
              <span className="font-medium text-foreground">
                {tracks.find((t) => t.trackId === activeTrackId)?.trackTitle ?? activeTrackId}
              </span>{" "}
              ·{" "}
              <button
                type="button"
                onClick={() => onSelectTrack("__clear__", "")}
                className="text-foreground/80 underline-offset-2 hover:underline"
              >
                {metricsStrings.topTracks.clearTrackFilter}
              </button>
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-foreground/60" htmlFor="top-tracks-sort">
            {metricsStrings.topTracks.sortByLabel}
          </label>
          <Select value={sortKey} onValueChange={(v) => onSortChange(v as TopTrackSortKey)}>
            <SelectTrigger id="top-tracks-sort" className="h-8 w-[180px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((opt) => (
                <SelectItem key={opt} value={opt} className="text-xs">
                  {metricsStrings.topTracks.sortBy[opt]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      {isLoading && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full" />
          ))}
        </div>
      )}

      {showPodium && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {podium.map((t) => (
            <PodiumCard
              key={t.trackId}
              track={t}
              delta={memoizedDeltas.get(t.trackId) ?? 0}
              sortKey={sortKey}
              isActive={activeTrackId === t.trackId}
              onSelect={() => onSelectTrack(t.trackId, t.trackTitle)}
            />
          ))}
        </div>
      )}

      {(showPodium || showCompactOnly) && (
        <>
          {(showCompactOnly ? podium : rest).length > 0 && (
            <div className="flex flex-col gap-1">
              {showPodium && (
                <p className="px-1 text-[11px] font-medium uppercase tracking-wide text-foreground/50">
                  {metricsStrings.topTracks.rankingHeading}
                </p>
              )}
              <ul className="flex flex-col gap-1">
                {(showCompactOnly ? podium : rest).map((t) => (
                  <CompactRow
                    key={t.trackId}
                    track={t}
                    delta={memoizedDeltas.get(t.trackId) ?? 0}
                    sortKey={sortKey}
                    isActive={activeTrackId === t.trackId}
                    onSelect={() => onSelectTrack(t.trackId, t.trackTitle)}
                  />
                ))}
              </ul>
            </div>
          )}
          {list.length > 12 && (
            <button
              type="button"
              onClick={() => setShowAllOpen(true)}
              className="self-start text-xs font-medium text-foreground/80 underline-offset-2 hover:underline"
            >
              {interpolateString(metricsStrings.topTracks.showAll, { count: list.length })}
            </button>
          )}
        </>
      )}

      <Dialog open={showAllOpen} onOpenChange={setShowAllOpen}>
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{metricsStrings.topTracks.showAllModalTitle}</DialogTitle>
          </DialogHeader>
          <ul className="flex flex-col gap-1">
            {list.map((t) => (
              <CompactRow
                key={t.trackId}
                track={t}
                delta={memoizedDeltas.get(t.trackId) ?? 0}
                sortKey={sortKey}
                isActive={activeTrackId === t.trackId}
                onSelect={() => {
                  onSelectTrack(t.trackId, t.trackTitle);
                  setShowAllOpen(false);
                }}
              />
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
