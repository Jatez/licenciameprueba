import { TrackNotFoundState } from "@/modules/tracks/components/TrackDetailPage/empty-states/TrackNotFoundState";
import { TrackRemovedState } from "@/modules/tracks/components/TrackDetailPage/empty-states/TrackRemovedState";
import { TrackDetailErrorState } from "@/modules/tracks/components/TrackDetailPage/empty-states/TrackDetailErrorState";
import { DSSectionHeader } from "../../components/DSSectionHeader";
import { DSSectionBody } from "../../components/DSSectionBody";
import {
  DSComponentSpec,
  DSAnatomy,
  DSVariants,
  DSStates,
  DSCollapsibleTokens,
  DSCollapsibleA11y,
  DSUsage,
  DSCode,
} from "../../components/spec";
import { DSCatalogDemoWrapper } from "./_shared/DSCatalogDemoWrapper";

const TODAY = "2026-04-24";
const VERSION = "v1.0.0";

const DECISIONS = [
  { code: "TRACK_NOT_FOUND", render: "<TrackNotFoundState />", reason: "El ID en la URL no existe (link roto, typo)." },
  { code: "TRACK_REMOVED", render: "<TrackRemovedState />", reason: "El track existió pero fue removido del catálogo." },
  { code: "otros", render: "<TrackDetailErrorState onRetry />", reason: "Error de red/servidor genérico. Reintentable." },
];

const ANATOMY = [
  { name: "Icon hero", desc: "h-16 w-16 rounded-full bg-muted (NotFound, Removed) o Alert variant=destructive (Error)." },
  { name: "Title h1", desc: "Texto principal: 'Esta canción no existe', 'Ya no está disponible', etc." },
  { name: "Description", desc: "Contexto al usuario, max-w-md." },
  { name: "CTA(s)", desc: "NotFound: volver al catálogo. Removed: volver + ver populares. Error: reintentar." },
];

const TOKENS = [
  "rounded-card border border-border bg-surface",
  "p-12 (centered hero)",
  "h-16 w-16 rounded-full bg-muted (icon container)",
  "Alert variant=destructive (error)",
  "max-w-md (description)",
];

const A11Y = [
  "<section role='alert'> en NotFound y Removed — anuncio inmediato.",
  "ErrorState usa <Alert variant='destructive'> que ya expone role='alert'.",
  "Botones de CTA son <Button> nativos — Tab nav.",
  "Iconos siempre aria-hidden — la información es textual.",
];

const DOS = [
  "Branchear por error.code: TRACK_NOT_FOUND → notFound, TRACK_REMOVED → removed, default → error.",
  "Mantener BackButton siempre arriba del estado para que el usuario pueda salir.",
  "Pasar onRetry={refetch} al ErrorState — recuperación de un solo click.",
  "Removed ofrece 2 CTAs — primario volver, secundario explorar populares (mantiene engagement).",
];

const DONTS = [
  "Mostrar TrackDetailErrorState para 404 — confunde al usuario (no es un error reintentable).",
  "Quitar el role='alert' — los screen readers necesitan saber que algo cambió.",
  "Inventar copys distintos a catalogStrings.trackDetailStates.* — i18n centralizado.",
  "Permitir reintentar Removed — el track no va a regresar.",
];

const SNIPPET = `import {
  TrackNotFoundState,
  TrackRemovedState,
  TrackDetailErrorState,
} from "@/modules/tracks/components/TrackDetailPage/empty-states";
import { isApiError } from "@/api/client";

if (isError) {
  const code = isApiError(error) ? error.code : null;
  return code === "TRACK_NOT_FOUND" ? (
    <TrackNotFoundState />
  ) : code === "TRACK_REMOVED" ? (
    <TrackRemovedState />
  ) : (
    <TrackDetailErrorState onRetry={() => refetch()} />
  );
}`;

export function TrackDetailEmptyStatesSection() {
  return (
    <>
      <DSSectionHeader
        id="track-detail-empty-states"
        title={`Track Detail Empty States — ${VERSION}`}
        status="stable"
        lastUpdate={TODAY}
        componentName="<TrackNotFoundState /> · <TrackRemovedState /> · <TrackDetailErrorState />"
      />
      <DSComponentSpec
        description="Los 3 estados especiales del detalle: track no existe (404), track removido del catálogo, error genérico de carga."
        layout="split"
      >
        <DSSectionBody
          layout="split"
          left={
            <>
              <a
                href="/catalog/track/mock-removed"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline"
              >
                Ver en vivo → <code className="rounded bg-muted px-1 text-xs">/catalog/track/mock-removed</code>
              </a>
              <DSAnatomy parts={ANATOMY} />
              <DSUsage dos={DOS} donts={DONTS} />
              <DSCollapsibleA11y items={A11Y} />
              <DSCollapsibleTokens tokens={TOKENS} />
            </>
          }
          right={
            <>
              <DSVariants>
                <div className="space-y-4">
                  <Box label="TrackNotFoundState">
                    <TrackNotFoundState />
                  </Box>
                  <Box label="TrackRemovedState">
                    <TrackRemovedState />
                  </Box>
                  <Box label="TrackDetailErrorState">
                    <TrackDetailErrorState onRetry={() => undefined} />
                  </Box>
                </div>
              </DSVariants>
              <DSStates
                states={[
                  {
                    label: "Pendiente de documentación",
                    node: (
                      <p className="text-[11px] italic text-muted-foreground text-center">
                        Cada estado es estático — ver Variantes.
                      </p>
                    ),
                  },
                ]}
              />
              <section>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Tabla de decisión por error.code
                </h3>
                <div className="overflow-x-auto rounded-card border border-border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold">error.code</th>
                        <th className="px-3 py-2 text-left font-semibold">Renderiza</th>
                        <th className="px-3 py-2 text-left font-semibold">Razón</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DECISIONS.map((d) => (
                        <tr key={d.code} className="border-t border-border">
                          <td className="px-3 py-2 font-mono text-xs text-foreground">{d.code}</td>
                          <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{d.render}</td>
                          <td className="px-3 py-2 text-xs text-muted-foreground">{d.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
              <DSCode snippet={SNIPPET} collapsedByDefault />
            </>
          }
        />
      </DSComponentSpec>
    </>
  );
}

function Box({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <DSCatalogDemoWrapper>{children}</DSCatalogDemoWrapper>
    </div>
  );
}
