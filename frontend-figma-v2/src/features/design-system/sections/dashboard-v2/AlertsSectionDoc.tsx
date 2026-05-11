import { AlertTriangle, ArrowRight, Info, ShieldAlert, X } from "lucide-react";
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

const TODAY = "2026-04-23";
const VERSION = "v1.0.0";

const ANATOMY = [
  { name: "AlertsSection", desc: "Contenedor <section aria-live=\"polite\"> que ordena por severidad y muestra solo la alerta top." },
  { name: "AlertBanner", desc: "Banner inline pill con icon-bubble + título + mensaje + CTA + dismiss." },
  { name: "IconBubble", desc: "Avatar circular bg-foreground/10 con icono semántico (ShieldAlert/AlertTriangle/Info)." },
  { name: "DismissButton", desc: "Botón ghost con animación exit (-translate-y-2 + fade) controlada por dashboardStore." },
];

const TOKENS = [
  "rounded-xl",
  "bg-primary",
  "px-4 py-2.5",
  "text-foreground",
  "bg-foreground/10 (icon bubble)",
  "bg-foreground (cta solid)",
  "text-background (cta label)",
  "motion-safe:animate-fade-in",
  "duration-200 ease-out",
];

const A11Y = [
  "Severity \"critical\" agrega role=\"alert\" — anuncia interrupción.",
  "Wrapper con aria-live=\"polite\" para anuncios no críticos.",
  "Botón dismiss con aria-label desde strings (no solo el ícono X).",
  "Animación de salida respeta motion-reduce — sin transform en ese caso.",
  "Solo se muestra UNA alerta a la vez (la de mayor severidad). Resto queda en cola.",
];

const DOS = [
  "Usar critical solo para acciones bloqueantes o pérdida inminente (saldo en 0, bolsa vence hoy).",
  "Mantener el mensaje en una línea — la pill es inline, no un modal.",
  "Pasar siempre ctaLabel + ctaRoute si la alerta es accionable.",
  "Marcar dismissible: false en alertas críticas que requieren acción.",
];

const DONTS = [
  "Apilar múltiples banners — el componente ya filtra al de mayor severidad.",
  "Cambiar el color de fondo según severity — el patrón actual usa bg-primary unificado.",
  "Renderizar HTML rico dentro del mensaje — solo strings.",
  "Bloquear la UI con un modal cuando una pill basta.",
];

const SNIPPET = `import { AlertsSection } from "@/modules/packages/dashboards/dashboard-v2/components/AlertsSection";

const activeAlerts = useActiveAlerts(dashboard.data?.alerts);

{activeAlerts.length > 0 && <AlertsSection alerts={activeAlerts} />}

// AlertBanner directamente (raro):
<AlertBanner
  alert={{
    id: "low-balance",
    severity: "warning",
    title: "Tu bolsa está por vencer",
    message: "Vence en 45 días. Quedan 180 créditos.",
    ctaLabel: "Comprar créditos",
    ctaRoute: "/packages",
    dismissible: true,
  }}
  onDismiss={dismissAlert}
/>`;

function MiniBanner({
  Icon,
  title,
  message,
  showCta = true,
  showDismiss = true,
}: {
  Icon: typeof Info;
  title: string;
  message: string;
  showCta?: boolean;
  showDismiss?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-foreground">
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground/10">
        <Icon className="h-3 w-3" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold leading-tight">{title}</p>
        <p className="truncate text-[10px] text-foreground/70">{message}</p>
      </div>
      {showCta && (
        <span className="inline-flex items-center gap-0.5 rounded bg-foreground px-1.5 py-0.5 text-[9px] font-medium text-background">
          CTA
          <ArrowRight className="h-2.5 w-2.5" aria-hidden="true" />
        </span>
      )}
      {showDismiss && <X className="h-3 w-3 text-foreground/70" aria-hidden="true" />}
    </div>
  );
}

const STATES = [
  {
    label: "info",
    node: <MiniBanner Icon={Info} title="Sugerencia" message="Conecta una cuenta social" />,
  },
  {
    label: "warning",
    node: <MiniBanner Icon={AlertTriangle} title="Bolsa por vencer" message="Vence en 45 días" />,
  },
  {
    label: "critical",
    className: 'role="alert"',
    node: <MiniBanner Icon={ShieldAlert} title="Saldo agotado" message="Recarga ahora" showDismiss={false} />,
  },
  {
    label: "no-cta",
    node: <MiniBanner Icon={Info} title="Mantenimiento" message="Sincronización en curso" showCta={false} />,
  },
  {
    label: "exiting",
    className: "opacity-0 -translate-y-2",
    node: (
      <div className="opacity-40 -translate-y-1">
        <MiniBanner Icon={AlertTriangle} title="Bolsa por vencer" message="Vence en 45 días" />
      </div>
    ),
  },
];

export function AlertsSectionDoc() {
  return (
    <>
      <DSSectionHeader
        id="alerts-section"
        title={`Alerts Section — ${VERSION}`}
        status="stable"
        lastUpdate={TODAY}
        componentName="<AlertsSection /> · <AlertBanner />"
      />
      <DSComponentSpec description="Sistema de alertas inline del dashboard v2. Renderiza un único banner pill (la alerta de mayor severidad) con micro-acción y dismiss. Animación motion-safe de entrada y salida." layout="split">
        <DSSectionBody
          layout="split"
          left={
            <>
              <a
          href="/dashboard03"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-foreground hover:underline"
        >
          Ver en vivo → <code className="rounded bg-muted px-1 text-xs">/dashboard03</code>
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
          <div className="space-y-3">
            <MiniBanner
              Icon={AlertTriangle}
              title="Tu bolsa está por vencer"
              message="Vence en 45 días. Quedan 180 créditos sin usar."
            />
            <MiniBanner
              Icon={ShieldAlert}
              title="Saldo en cero"
              message="Compra créditos para emitir nuevas licencias."
              showDismiss={false}
            />
            <MiniBanner
              Icon={Info}
              title="Conecta una red social"
              message="Activa el rastreo automático de publicaciones."
            />
          </div>
        </DSVariants>
              <DSStates states={STATES} />
              <DSCode snippet={SNIPPET} collapsedByDefault />
            </>
          }
        />
      </DSComponentSpec>
    </>
  );
}
