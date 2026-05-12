import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LargePlaylistNotice,
  PlaylistAnalyzeStepper,
  PlaylistMatchSummary,
  PlaylistMetaCard,
  SpotifyApiErrorState,
  SpotifyMatchResultsTable,
  ZeroMatchesState,
  demoPlaylistMeta,
  demoPlaylistSummary,
  demoSpotifyTracks,
  matchTracksStrings as s,
} from "@/modules/monitoring/match-tracks";
import type { SpotifyAnalyzePhase } from "@/modules/monitoring/match-tracks";
import { AppPageHeader } from "@/shared/components/layout/AppPageHeader";

const PAGE_SIZE = 3; // we only have 6 mock rows; split into 3 pages of 2 visually-meaningful chunks
// Use 2 per page so 6 rows → 3 pages, mirroring "Página 1 de 3" copy
const ROWS_PER_PAGE = 2;

export default function MatchTracksSpotify() {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [phase, setPhase] = useState<SpotifyAnalyzePhase>("idle");
  const [page, setPage] = useState(1);

  const isLarge = demoPlaylistMeta.totalTracks > 100;
  const totalPages = Math.max(1, Math.ceil(demoSpotifyTracks.length / ROWS_PER_PAGE));
  const pagedRows = useMemo(() => {
    if (!isLarge) return demoSpotifyTracks;
    const start = (page - 1) * ROWS_PER_PAGE;
    return demoSpotifyTracks.slice(start, start + ROWS_PER_PAGE);
  }, [isLarge, page]);

  function startAnalysis(opts?: { forceError?: boolean; forceZero?: boolean }) {
    setPhase("analyzing");
    setPage(1);
    window.setTimeout(() => {
      if (opts?.forceError) setPhase("error");
      else if (opts?.forceZero) setPhase("results_zero");
      else setPhase("results");
    }, 3200);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    startAnalysis();
  }

  function reset() {
    setPhase("idle");
    setValue("");
  }

  return (
    <>
      <AppPageHeader
        title={s.spotify.title}
        description={s.spotify.subtitle}
        liftStickyDesktop
        primaryAction={{
          label: "Volver",
          icon: <ArrowLeft className="h-4 w-4" aria-hidden="true" />,
          onClick: () => navigate("/match-tracks"),
        }}
      />

      <div className="mb-6 max-w-2xl">
        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background">
          <Music className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>

      {phase === "idle" && (
        <div className="space-y-4">
          <Card className="max-w-2xl p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="playlist-url">{s.spotify.inputLabel}</Label>
                <Input
                  id="playlist-url"
                  placeholder={s.spotify.inputPlaceholder}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">{s.spotify.helper}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="submit" disabled={!value.trim()}>
                  {s.spotify.submit}
                </Button>
                <Button type="button" variant="outline" onClick={() => startAnalysis()}>
                  {s.spotify.demo}
                </Button>
              </div>
            </form>
          </Card>

          <details className="max-w-2xl text-xs text-muted-foreground">
            <summary className="cursor-pointer">Estados de demo</summary>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button size="sm" variant="ghost" onClick={() => startAnalysis({ forceError: true })}>
                {s.spotify.triggerError}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => startAnalysis({ forceZero: true })}>
                {s.spotify.triggerZero}
              </Button>
            </div>
          </details>
        </div>
      )}

      {phase === "analyzing" && <PlaylistAnalyzeStepper onComplete={() => undefined} />}

      {phase === "error" && (
        <SpotifyApiErrorState onRetry={() => startAnalysis()} onUseDemo={() => startAnalysis()} />
      )}

      {phase === "results_zero" && (
        <div className="space-y-6">
          <PlaylistMetaCard meta={demoPlaylistMeta} />
          <ZeroMatchesState />
          <Button variant="ghost" size="sm" onClick={reset}>
            Analizar otra playlist
          </Button>
        </div>
      )}

      {phase === "results" && (
        <div className="space-y-6">
          <PlaylistMetaCard meta={demoPlaylistMeta} />
          <PlaylistMatchSummary
            analyzed={demoPlaylistSummary.analyzed}
            matched={demoPlaylistSummary.matched}
            partial={demoPlaylistSummary.partial}
            notAvailable={demoPlaylistSummary.notAvailable}
            matchRate={demoPlaylistSummary.matchRate}
            onPrimaryAction={() => navigate("/match-tracks/results?source=spotify")}
          />
          {isLarge && (
            <LargePlaylistNotice
              page={page}
              totalPages={totalPages}
              onPrev={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            />
          )}
          <SpotifyMatchResultsTable rows={pagedRows} />
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={reset}>
              Analizar otra playlist
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
