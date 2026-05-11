import { Banner } from "@/shared/components/notifications/Banner";
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
  { name: "Icon", desc: "Lucide del tono, color text-{tone}." },
  { name: "Title", desc: "Opcional, font-semibold, en línea con el copy en desktop." },
  { name: "Message", desc: "1 línea desktop, 2 líneas mobile (line-clamp-2)." },
  { name: "CTAs", desc: "Primary bg-lm-black text-white. Secondary border lm-black/20. Nunca tintados al tono." },
  { name: "Close (×)", desc: "Botón opcional al final, aria-label='Cerrar'." },
];

const TOKENS = [
  "bg-success-subtle/40", "bg-info-subtle/40", "bg-warning-subtle/40", "bg-error-subtle/40",
  "bg-surface", "border border-{tone}-subtle",
  "bg-lm-black text-white", "rounded-pill", "rounded-lg",
];

const A11Y = [
  "Contenedor con role='status' (no interruptivo).",
  "CTA primario con foco visible (focus-ring del DS).",
  "Iconos decorativos aria-hidden='true'; el título y mensaje comunican.",
];

const DOS = [
  "Usar para avisos persistentes en página (saldo bajo, paquete por vencer, MFA pendiente).",
  "Variante filled (default) para mayor prominencia; outlined cuando convive con otros banners.",
  "CTA siempre en negro — el tono lo da el icono y el fondo, no el botón.",
];

const DONTS = [
  "Usar para confirmaciones efímeras — eso es Toast.",
  "Apilar más de 2 banners en la misma pantalla.",
  "Pintar el CTA del color del tono (rompe consistencia y jerarquía).",
];

const SNIPPET = `import { Banner } from "@/shared/components/notifications/Banner";

<Banner
  tone="warning"
  variant="filled"
  title="Saldo bajo"
  message="Te quedan 12 créditos. Recarga para no interrumpir tus licencias."
  primaryCta={{ label: "Recargar", onClick: () => {} }}
  onClose={() => {}}
/>`;

export function BannerSection() {
  return (
    <>
      <DSSectionHeader
        id="banner"
        title="Banner — Aviso persistente in-page"
        status="stable"
        lastUpdate={TODAY}
        componentName="<Banner />"
      />
      <DSComponentSpec
        description="Aviso horizontal que vive embebido en la página: icono · título · copy · CTA negro · cerrar. Dos variantes (filled default, outlined). Cuatro tonos semánticos del DS. Cero HEX en JSX."
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
                <div className="space-y-6 rounded-card border border-border bg-card p-5">
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Filled (default)
                    </h4>
                    <Banner tone="success" title="Licencia emitida" message="La licencia LIC-2089 está disponible en tu biblioteca." primaryCta={{ label: "Ver" }} onClose={() => {}} />
                    <Banner tone="info" title="MFA recomendado" message="Activa la verificación en dos pasos para proteger tu cuenta." primaryCta={{ label: "Activar" }} onClose={() => {}} />
                    <Banner tone="warning" title="Saldo bajo" message="Te quedan 12 créditos. Recarga para evitar interrupciones." primaryCta={{ label: "Recargar" }} onClose={() => {}} />
                    <Banner tone="error" title="Pago rechazado" message="No pudimos procesar tu última recarga. Verifica el método." primaryCta={{ label: "Revisar" }} onClose={() => {}} />
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Outlined
                    </h4>
                    <Banner variant="outlined" tone="info" message="Tu sesión expira en 5 minutos." primaryCta={{ label: "Extender" }} onClose={() => {}} />
                    <Banner variant="outlined" tone="warning" title="Bolsa por vencer" message="Tu paquete vence en 7 días." onClose={() => {}} />
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