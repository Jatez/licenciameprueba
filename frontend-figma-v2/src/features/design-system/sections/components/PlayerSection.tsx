import { Music, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrackPreviewButton } from "@/shared/components/ds/TrackPreviewButton";
import { DSSectionHeader } from "../../components/DSSectionHeader";
import { DSSectionBody } from "../../components/DSSectionBody";
import {
  DSComponentSpec,
  DSAnatomy,
  DSVariants,
  DSStates,
  DSCode,
  DSCollapsibleA11y,
  DSCollapsibleTokens,
  DSUsage,
} from "../../components/spec";

const TODAY = "2026-04-24";

const PLAYER_ANATOMY = [
  { name: "PersistentPlayer", desc: "Contenedor fijo (z-40) con frosted glass que persiste entre rutas." },
  { name: "PlayerTrackInfo", desc: "Cover, título y artista del track activo." },
  { name: "PlayerControls", desc: "Skip back · play/pause · skip forward · time." },
  { name: "PlayerProgress", desc: "Barra de progreso seekable con cursor en hover." },
  { name: "PlayerVolumeControl", desc: "Slider de volumen + mute (solo desktop)." },
  { name: "PlayerActions", desc: "Licenciar · cerrar." },
  { name: "PlayerErrorBanner", desc: "Banner de error que aparece encima cuando falla la carga." },
  { name: "TrackPreviewButton", desc: "Trigger reutilizable: variantes overlay (sobre cover) y standalone (toolbar)." },
];

const PLAYER_A11Y = [
  'Contenedor con role="region" y aria-label="Reproductor de música".',
  "Live region polite anuncia play/pause/error con título y artista.",
  'Botón principal expone aria-pressed según estado de reproducción.',
  "Atajos de teclado: Space (play/pause), ←/→ (seek 5s), M (mute), F (favorito).",
  "Focus visible con focus-visible:ring-2 ring-primary en todos los controles.",
  "El sheet expandido en mobile atrapa el foco mientras está abierto.",
];

const PLAYER_DOS = [
  "Montar <PersistentPlayer /> una sola vez en el shell de la app.",
  "Disparar reproducción siempre vía usePlayer().loadAndPlay() — nunca crear <audio> nuevos.",
  "Usar <TrackPreviewButton variant=\"overlay\" /> para covers en grids/listas.",
  "Usar <TrackPreviewButton variant=\"standalone\" /> en toolbars y páginas de detalle.",
];

const PLAYER_DONTS = [
  "Crear elementos <audio> propios en componentes de feature.",
  "Duplicar el JSX del overlay scrim+circle en cada card (usa la primitiva).",
  "Subir el z-index por encima de 40 (rompe el drawer de mobile).",
  "Asumir que el player siempre está visible — devuelve null cuando no hay track.",
];

const PREVIEW_BUTTON_CODE = `import { TrackPreviewButton } from "@/shared/components/ds/TrackPreviewButton";
import { usePlayer } from "@/modules/packages/player/hooks/usePlayer";

function CardPlayBadge({ track }) {
  const { currentTrack, isPlaying, loadAndPlay, togglePlay } = usePlayer();
  const isActive = currentTrack?.id === track.id;
  const isThisPlaying = isActive && isPlaying;

  return (
    <TrackPreviewButton
      isPlaying={isThisPlaying}
      onClick={() => (isActive ? togglePlay() : loadAndPlay(track))}
      variant="overlay"
      size="md"
      forceVisible={isActive}
      overlayOpacity={0.35}
      playLabel="Reproducir preview"
      pauseLabel="Pausar preview"
    />
  );
}

// In the app shell:
import { PersistentPlayer } from "@/modules/packages/player/components/PersistentPlayer";

<AppLayout>
  <Routes>...</Routes>
  <PersistentPlayer />
</AppLayout>`;

function MockPlayerDesktop() {
  return (
    <div className="rounded-card border border-border bg-surface/95 backdrop-blur-xl shadow-lg p-4">
      <div className="grid grid-cols-[minmax(180px,25%)_1fr_minmax(160px,28%)] items-center gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-12 w-12 shrink-0 rounded-md bg-muted flex items-center justify-center">
            <Music className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">Sunset Boulevard</p>
            <p className="truncate text-xs text-muted-foreground">Cosmic Riders</p>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <SkipBack className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button size="icon" className="h-9 w-9 rounded-full">
              <Pause className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <SkipForward className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-tnum">
            <span>0:14</span>
            <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-foreground" style={{ width: "47%" }} />
            </div>
            <span>0:30</span>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Volume2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <div className="w-20 h-1 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-foreground" style={{ width: "70%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MockPlayerMobile() {
  return (
    <div className="mx-auto w-[320px] rounded-card border border-border bg-surface/95 backdrop-blur-xl shadow-lg p-3">
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 shrink-0 rounded-md bg-muted flex items-center justify-center">
          <Music className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-foreground">Sunset Boulevard</p>
          <p className="truncate text-xs text-muted-foreground">Cosmic Riders</p>
        </div>
        <Button size="icon" className="h-8 w-8 rounded-full">
          <Pause className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
      </div>
      <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-foreground" style={{ width: "47%" }} />
      </div>
    </div>
  );
}

function MockOverlayContainer({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div className={`group relative h-32 w-32 overflow-hidden rounded-card bg-muted ${active ? "ring-2 ring-primary" : ""}`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <Music className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
      </div>
      {children}
    </div>
  );
}

export function PlayerSection() {
  return (
    <>
      <DSSectionHeader
        id="player"
        title="Player"
        status="stable"
        lastUpdate={TODAY}
        componentName="<PersistentPlayer /> · <TrackPreviewButton />"
      />
      <DSComponentSpec
        description="Reproductor global persistente entre rutas (z-40, frosted glass) y trigger reutilizable de preview. Toda la app comparte una única instancia de audio: jamás se crean elementos <audio> en componentes de feature."
        layout="split"
      >
        <DSSectionBody
          layout="split"
          left={
            <>
              <DSAnatomy parts={PLAYER_ANATOMY} />
              <DSUsage dos={PLAYER_DOS} donts={PLAYER_DONTS} />
              <DSCollapsibleA11y items={PLAYER_A11Y} />
              <DSCollapsibleTokens
                tokens={[
                  "bg-surface/95",
                  "backdrop-blur-xl",
                  "z-40",
                  "rounded-card",
                  "border-lm-gray-200",
                  "bg-primary text-ink-900",
                  "h-12 w-12 (circle md)",
                  "h-10 w-10 (circle sm)",
                  "hsl(var(--ink-900)/0.35) (overlay scrim)",
                  "hsl(var(--ink-900)/0.45) (overlay scrim alt)",
                ]}
              />
            </>
          }
          right={
            <>
              <DSVariants>
                <div className="space-y-6">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      PersistentPlayer · desktop
                    </p>
                    <MockPlayerDesktop />
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      PersistentPlayer · mobile (375px)
                    </p>
                    <MockPlayerMobile />
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      TrackPreviewButton · standalone
                    </p>
                    <div className="flex items-center gap-3">
                      <TrackPreviewButton
                        isPlaying={false}
                        onClick={() => {}}
                        variant="standalone"
                        playLabel="Reproducir preview"
                        pauseLabel="Pausar preview"
                        standaloneLabel="Reproducir preview (30s)"
                      />
                      <TrackPreviewButton
                        isPlaying
                        onClick={() => {}}
                        variant="standalone"
                        playLabel="Reproducir preview"
                        pauseLabel="Pausar preview"
                        standaloneLabel="Pausar preview"
                      />
                    </div>
                  </div>
                </div>
              </DSVariants>

              <DSStates
                states={[
                  {
                    label: "Overlay · default",
                    node: (
                      <MockOverlayContainer>
                        <TrackPreviewButton
                          isPlaying={false}
                          onClick={() => {}}
                          variant="overlay"
                          forceVisible
                          playLabel="Reproducir preview"
                          pauseLabel="Pausar preview"
                        />
                      </MockOverlayContainer>
                    ),
                  },
                  {
                    label: "Overlay · playing (active)",
                    node: (
                      <MockOverlayContainer active>
                        <TrackPreviewButton
                          isPlaying
                          onClick={() => {}}
                          variant="overlay"
                          forceVisible
                          playLabel="Reproducir preview"
                          pauseLabel="Pausar preview"
                        />
                      </MockOverlayContainer>
                    ),
                  },
                  {
                    label: "Overlay · sm + scrim 0.45",
                    node: (
                      <MockOverlayContainer>
                        <TrackPreviewButton
                          isPlaying={false}
                          onClick={() => {}}
                          variant="overlay"
                          size="sm"
                          overlayOpacity={0.45}
                          forceVisible
                          playLabel="Reproducir preview"
                          pauseLabel="Pausar preview"
                        />
                      </MockOverlayContainer>
                    ),
                  },
                ]}
              />

              <DSCode snippet={PREVIEW_BUTTON_CODE} collapsedByDefault />
            </>
          }
        />
      </DSComponentSpec>
    </>
  );
}
