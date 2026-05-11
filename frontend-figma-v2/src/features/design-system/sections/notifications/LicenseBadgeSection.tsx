import { LicenseBadge } from "@/shared/components/notifications/LicenseBadge";
import { DSSectionHeader } from "../../components/DSSectionHeader";
import { DSSectionBody } from "../../components/DSSectionBody";
import {
  DSComponentSpec,
  DSAnatomy,
  DSVariants,
  DSUsage,
  DSCode,
  DSCollapsibleA11y,
  DSCollapsibleTokens,
} from "../../components/spec";

const TODAY = "2026-05-04";

const ANATOMY = [
  { name: "Badge wrapper", desc: "Reusa el <Badge /> del DS con su variant correspondiente." },
  { name: "Status mapping", desc: "vigente → variant 'vigente'; consumida → 'consumida'; expirada → 'expirada'; anulada → 'destructive'." },
];

const TOKENS = [
  "bg-success-subtle", "bg-consumida-subtle",
  "bg-muted", "text-muted-foreground", "bg-destructive",
];

const A11Y = [
  "El estado se comunica por texto, no solo por color.",
  "Variante destructive (anulada) tiene contraste reforzado para señalar irreversibilidad.",
];

const DOS = [
  "Usar en listados de licencias, detalle de licencia y cards de uso.",
  "Mantener un único estado por licencia en cada momento.",
];

const DONTS = [
  "Crear nuevos estados ad-hoc — definir primero la variant en /ui/badge.",
  "Usar para badges de género o categoría — eso es <Badge variant='metric' />.",
];

const SNIPPET = `import { LicenseBadge } from "@/shared/components/notifications/LicenseBadge";

<LicenseBadge status="vigente" />
<LicenseBadge status="consumida" />
<LicenseBadge status="expirada" />
<LicenseBadge status="anulada" />`;

export function LicenseBadgeSection() {
  return (
    <>
      <DSSectionHeader
        id="license-badge"
        title="License Badge — Estado de licencia"
        status="stable"
        lastUpdate={TODAY}
        componentName="<LicenseBadge />"
      />
      <DSComponentSpec
        description="Badge específico para el estado de una licencia emitida. Wrapper del <Badge /> del DS con mapping fijo de status → variant. Garantiza consistencia entre listados, detalles y reportes."
        layout="split"
      >
        <DSSectionBody
          layout="split"
          left={
            <>
              <DSAnatomy parts={ANATOMY} />
              <DSUsage dos={DOS} donts={DONTS} />
              <DSCollapsibleA11y items={A11Y} />
              <DSCollapsibleTokens tokens={TOKENS} />
            </>
          }
          right={
            <>
              <DSVariants>
                <div className="rounded-card border border-border bg-card p-5">
                  <div className="flex flex-wrap gap-3">
                    <LicenseBadge status="vigente" />
                    <LicenseBadge status="consumida" />
                    <LicenseBadge status="expirada" />
                    <LicenseBadge status="anulada" />
                  </div>
                </div>
              </DSVariants>
              <DSCode snippet={SNIPPET} collapsedByDefault />
            </>
          }
        />
      </DSComponentSpec>
    </>
  );
}