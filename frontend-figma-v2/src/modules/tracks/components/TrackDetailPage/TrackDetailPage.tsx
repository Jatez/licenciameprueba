import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { isApiError } from "@/api/client";
import { useTrackDetail } from "@/modules/tracks/hooks/useTrackDetail";
import { useFeatureFlag } from "@/shared/hooks/useFeatureFlag";
import { isTypingTarget } from "@/modules/tracks/utils";
import { TrackDetailFrostedNav } from "./parts/TrackDetailFrostedNav";
import { TrackDetailHero } from "./parts/TrackDetailHero";
import { TrackDetailMeta } from "./parts/TrackDetailMeta";
import { TrackDetailFallbackPlayer } from "./parts/TrackDetailFallbackPlayer";
import { SimilarTracks } from "../SimilarTracks";
import { TrackDetailSkeleton } from "./TrackDetailSkeleton";
import { TrackNotFoundState } from "./empty-states/TrackNotFoundState";
import { TrackRemovedState } from "./empty-states/TrackRemovedState";
import { TrackDetailErrorState } from "./empty-states/TrackDetailErrorState";
import { platformsLicensableFor } from "@/api/mocks/tracks.mocks";
import type { Track, TrackSummary } from "@/api/types";

function trackToSummary(track: Track): TrackSummary {
  return {
    id: track.id,
    title: track.title,
    artist: track.artist,
    coverUrl: track.coverUrl,
    genre: track.genre,
    moods: track.moods,
    durationSec: track.durationSec,
    previewUrl: track.previewUrl,
    waveformPeaks: track.waveformPeaks,
    popularityScore: track.popularityScore,
    platformsLicensable: platformsLicensableFor(track),
    isFavorite: track.isFavorite,
  };
}

export function TrackDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, error, refetch } = useTrackDetail(id);
  const similarFlag = useFeatureFlag("FEATURE_SIMILAR_TRACKS");

  // Keyboard shortcut: `L` focuses the Licenciar CTA.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "l" && e.key !== "L") return;
      if (isTypingTarget(e.target)) return;
      const btn = document.getElementById("track-detail-license-cta") as HTMLElement | null;
      btn?.focus();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <TrackDetailFrostedNav />
        <TrackDetailSkeleton />
      </div>
    );
  }

  if (isError) {
    const code = isApiError(error) ? error.code : null;
    return (
      <div className="space-y-6">
        <TrackDetailFrostedNav />
        {code === "TRACK_NOT_FOUND" ? (
          <TrackNotFoundState />
        ) : code === "TRACK_REMOVED" ? (
          <TrackRemovedState />
        ) : (
          <TrackDetailErrorState onRetry={() => refetch()} />
        )}
      </div>
    );
  }

  if (!data) {
    // Defensive: should not happen once isLoading/isError are handled.
    return (
      <div className="space-y-6">
        <TrackDetailFrostedNav />
        <TrackDetailErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  const { track, similarTracks } = data;
  const summary = trackToSummary(track);

  return (
    <div className="space-y-8">
      <TrackDetailFrostedNav trackTitle={track.title} />

      {/* span for the id-target used by L shortcut */}
      <span className="sr-only" id="track-detail-license-anchor" />

      <TrackDetailHero track={track} />

      {/* Waveform visual removed — fallback player covers playback. */}
      <TrackDetailFallbackPlayer track={summary} />

      <TrackDetailMeta track={track} />

      {similarFlag && similarTracks && similarTracks.length > 0 ? (
        <SimilarTracks tracks={similarTracks} genre={track.genre} />
      ) : null}
    </div>
  );
}
