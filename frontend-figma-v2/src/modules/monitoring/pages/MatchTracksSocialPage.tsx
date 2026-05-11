import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Radar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DetectedTracksTable,
  NoMetadataNotice,
  NoPostsDetectedState,
  PlatformErrorState,
  PlatformIntegrationCard,
  SocialMatchMetrics,
  SocialSyncStepper,
  SourceExplanationCard,
  matchTracksStrings as s,
  socialDetections,
  socialIntegrations,
} from "@/modules/monitoring/match-tracks";
import type { SocialPlatform } from "@/modules/monitoring/match-tracks";

type Phase = "idle" | "syncing" | "results" | "error" | "empty";

const PLATFORM_LABEL: Record<SocialPlatform, string> = {
  tiktok: "TikTok",
  meta: "Meta",
};

export default function MatchTracksSocial() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("idle");
  const [activePlatform, setActivePlatform] = useState<SocialPlatform | null>(null);

  const integrationByPlatform = useMemo(
    () =>
      Object.fromEntries(
        socialIntegrations.map((i) => [i.platform, i]),
      ) as Record<string, (typeof socialIntegrations)[number]>,
    [],
  );

  function syncPlatform(platform: SocialPlatform, opts?: { error?: boolean; empty?: boolean }) {
    setActivePlatform(platform);
    setPhase("syncing");
    window.setTimeout(() => {
      if (opts?.error) setPhase("error");
      else if (opts?.empty) setPhase("empty");
      else setPhase("results");
    }, 3300);
  }

  function reset() {
    setPhase("idle");
    setActivePlatform(null);
  }

  return (
    <>
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate("/match-tracks")}>
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver
      </Button>

      <header className="mb-8 max-w-3xl">
        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background">
          <Radar className="h-5 w-5" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground">{s.social.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{s.social.subtitle}</p>
      </header>

      {/* Always visible: platform integrations */}
      <section className="mb-8" aria-label={s.social.integrationsTitle}>
        <h2 className="mb-3 text-lg font-semibold text-foreground">
          {s.social.integrationsTitle}
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <PlatformIntegrationCard
            platform="tiktok"
            status={integrationByPlatform.tiktok.status}
            onAction={() => syncPlatform("tiktok")}
            onError={() => syncPlatform("tiktok", { error: true })}
            loading={phase === "syncing" && activePlatform === "tiktok"}
          />
          <PlatformIntegrationCard
            platform="meta"
            status={integrationByPlatform.meta.status}
            onAction={() => syncPlatform("meta")}
            onError={() => syncPlatform("meta", { empty: true })}
            loading={phase === "syncing" && activePlatform === "meta"}
          />
          <PlatformIntegrationCard
            platform="spotify"
            status={integrationByPlatform.spotify.status}
            onAction={() => navigate("/match-tracks/spotify")}
          />
        </div>
      </section>

      {/* Always visible: source explanation */}
      <section className="mb-8">
        <SourceExplanationCard />
      </section>

      {/* Dynamic area */}
      {phase === "syncing" && activePlatform && (
        <SocialSyncStepper
          platformLabel={PLATFORM_LABEL[activePlatform]}
          onComplete={() => undefined}
        />
      )}

      {phase === "error" && (
        <PlatformErrorState onRetry={() => activePlatform && syncPlatform(activePlatform)} />
      )}

      {phase === "empty" && <NoPostsDetectedState />}

      {phase === "results" && (
        <div className="space-y-6">
          <SocialMatchMetrics />
          <div>
            <h3 className="mb-3 text-lg font-semibold text-foreground">
              {s.social.detectionsTitle}
            </h3>
            <DetectedTracksTable rows={socialDetections} />
          </div>
          <NoMetadataNotice />
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={reset}>
              Sincronizar otra plataforma
            </Button>
          </div>
        </div>
      )}

      {phase === "idle" && (
        <div className="rounded-lg border border-dashed border-border bg-background p-6 text-center text-sm text-muted-foreground">
          Sincroniza TikTok o Meta para ver detecciones de música.
        </div>
      )}
    </>
  );
}
