import { ArrowLeft, Image as ImageIcon, FileText, Music2 } from "lucide-react";
import { DSSectionHeader } from "../../components/DSSectionHeader";
import { getDSLastUpdated } from "@/config/designSystem";
import {
  DSComponentSpec,
  DSAnatomy,
  DSVariants,
  DSTokens,
  DSA11y,
  DSUsage,
  DSCode,
} from "../../components/spec";

const VERSION = "v1.0.0";

const ANATOMY = [
  { name: "BackButton", desc: "Link 'Volver al catálogo' con ArrowLeft." },
  { name: "TrackDetailHero", desc: "Cover grande + título + artista + CTA Licenciar (#track-detail-license-cta para shortcut L)." },
  { name: "Waveform / FallbackPlayer", desc: "Si FEATURE_WAVEFORM ON y waveformPeaks!=null → TrackDetailWaveform. Sino → TrackDetailFallbackPlayer (controles básicos)." },
  { name: "TrackDetailMeta", desc: "Columna izq: artist, álbum, género, duración, year, BPM, idioma, ISRC, moods, tags." },
  { name: "SimilarTracks", desc: "Carrusel/grid de tracks similares (si FEATURE_SIMILAR_TRACKS ON y similarTracks?.length > 0)." },
];

const TOKENS = [
  "space-y-8",
  "p-4 sm:p-6 lg:p-8",
  "rounded-card border border-border bg-surface (cards internas)",
];

const A11Y = [
  "BackButton primero — único elemento focusable visible al cargar.",
  "Atajo `L` enfoca el CTA Licenciar (#track-detail-license-cta).",
  "Hero usa <h1> con el título del track.",
  "Cada sección interna (meta, matrix, similars) con su propio <section aria-labelledby>.",
  "Skeleton durante isLoading — no flash de contenido vacío.",
];

const DOS = [
  "Mantener BackButton siempre visible arriba — UX de detail screens.",
  "Respetar feature flags: FEATURE_WAVEFORM, FEATURE_SIMILAR_TRACKS.",
  "Fallback al FallbackPlayer cuando no hay waveformPeaks — degrada con gracia.",
  "Manejar 3 errores distintos por error.code: TRACK_NOT_FOUND / TRACK_REMOVED / genérico (cross-ref Track Detail Empty States).",
];

const DONTS = [
  "Renderizar Waveform sin peaks — falla silenciosamente.",
  "Mostrar SimilarTracks vacío — la sección no renderiza si tracks.length === 0.",
  "Usar el persistent player como hero player — en /track/:id usamos el inline para foco contextual.",
  "Ocultar el ISRC — es metadata legal relevante.",
];

const SNIPPET = `import { TrackDetailPage } from "@/modules/tracks/components/TrackDetailPage";

// src/pages/TrackDetail.tsx (thin wrapper)
export default function TrackDetailRoute() {
  return (
    <OnboardingGuard>
      <TrackDetailPage />
    </OnboardingGuard>
  );
}

// Internamente:
const { id } = useParams();
const { data, isLoading, isError, error, refetch } = useTrackDetail(id);
// → renderiza skeleton / NotFound / Removed / Error / data`;

export function TrackDetailPageSection() {
  return (
    <>
      <DSSectionHeader
        id="track-detail-page"
        title={`Track Detail Page — ${VERSION}`}
        status="stable"
        lastUpdate={getDSLastUpdated("track-detail-page")}
        componentName="<TrackDetailPage /> · <TrackDetailSkeleton />"
      />
      <DSComponentSpec description="Pattern de la página de detalle del track. Hero con cover y CTA Licenciar, waveform (o fallback), metadata en columna, matriz de licenciabilidad y tracks similares.">
        <a
          href="/catalog/track/mock-popular"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-foreground hover:underline"
        >
          Ver en vivo → <code className="rounded bg-muted px-1 text-xs">/catalog/track/mock-popular</code>
        </a>

        <DSAnatomy parts={ANATOMY} />

        <DSVariants>
          <TrackDetailWireframe />
          <p className="mt-3 text-xs text-muted-foreground">
            Wireframe del layout. Feature flags activos:
            <code className="ml-1 rounded bg-muted px-1">FEATURE_WAVEFORM</code>,
            <code className="ml-1 rounded bg-muted px-1">FEATURE_SIMILAR_TRACKS</code>.
            Atajo de teclado <kbd className="rounded border border-border bg-muted px-1.5 text-[10px]">L</kbd> enfoca el CTA Licenciar.
          </p>
        </DSVariants>

        <DSTokens tokens={TOKENS} />
        <DSA11y items={A11Y} />
        <DSUsage dos={DOS} donts={DONTS} />
        <DSCode snippet={SNIPPET} />
      </DSComponentSpec>
    </>
  );
}

function TrackDetailWireframe() {
  return (
    <div className="space-y-3 rounded-card border border-dashed border-border bg-page-bg/60 p-4">
      <Block icon={<ArrowLeft className="h-3 w-3" />} label="BackButton" small />
      <Block icon={<ImageIcon className="h-3 w-3" />} label="TrackDetailHero (cover + título + Licenciar)" tall />
      <Block icon={<Music2 className="h-3 w-3" />} label="Waveform / FallbackPlayer" />
      <Block icon={<FileText className="h-3 w-3" />} label="TrackDetailMeta" tall />
      <Block icon={<Music2 className="h-3 w-3" />} label="SimilarTracks (opcional)" />
    </div>
  );
}

function Block({
  icon,
  label,
  tall,
  small,
}: {
  icon: React.ReactNode;
  label: string;
  tall?: boolean;
  small?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-1.5 rounded-md border border-border bg-card px-3 ${
        tall ? "py-6" : small ? "py-1.5" : "py-3"
      }`}
    >
      {icon}
      <span className="text-xs font-semibold text-foreground">{label}</span>
    </div>
  );
}
