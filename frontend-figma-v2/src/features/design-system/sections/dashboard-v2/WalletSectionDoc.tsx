import { ArrowRight } from "lucide-react";
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
import { MiniRing } from "./_shared/mocks";

const TODAY = "2026-04-23";
const VERSION = "v1.0.0";

const ANATOMY = [
  { name: "Card", desc: "Hero card sólido — único bloque bg-primary del dashboard. text-primary-foreground (negro)." },
  { name: "Header", desc: "Título + pill 'X días restantes' (bg-primary-foreground/10)." },
  { name: "WalletProgressRing", desc: "Anillo SVG con activeColor / trackColor configurables. Centro libre para valor." },
  { name: "ValueOverlay", desc: "Saldo absoluto (text-5xl font-tnum) + fracción 'de N créditos' centrados en el ring." },
  { name: "ExpiryLine", desc: "Fecha de vencimiento o estado 'noBag' debajo del ring." },
  { name: "PrimaryCTA", desc: "Button bg-primary-foreground text-primary — invierte el contraste para destacar." },
  { name: "SecondaryLink", desc: "Texto 'Ver historial →' con underline-offset-4 hover." },
];

const TOKENS = [
  "bg-primary",
  "text-primary-foreground",
  "rounded-card / p-6",
  "shadow-sm",
  "bg-primary-foreground/10 (pill)",
  "text-5xl / font-semibold / font-tnum (saldo)",
  "text-primary-foreground/75 (meta)",
  "h-11 (CTA)",
];

const A11Y = [
  "ProgressRing con role=\"img\" + aria-label '{value} de {total} créditos'.",
  "Pill de días restantes con font-tnum para alineación de cifras.",
  "Botón principal con foco visible (ring-primary heredado del DS).",
  "Link 'Ver historial' es <button> nativo — no <a> con role manual.",
  "Texto 'noBag' aparece cuando expiresAt es null — sin colapsar el layout.",
];

const DOS = [
  "Mantener este componente como ÚNICO hero color-block del dashboard — su impacto depende de la rareza.",
  "Usar formatCredits para el valor (separadores de miles consistentes con el locale).",
  "Pasar daysUntilExpiry para mostrar la pill — si es null, omite la pill (no cero).",
  "Loading state debe replicar el ring (circle skeleton) para evitar layout shift.",
];

const DONTS = [
  "Replicar el estilo bg-primary en otros bloques — pierde su rol de hero.",
  "Cambiar trackColor a un valor con menos contraste que 0.15 — el progreso deja de leerse.",
  "Mostrar fechas relativas en expiresOn — siempre fecha larga absoluta.",
  "Anidar más de 2 CTAs — 1 primario + 1 link máximo.",
];

const SNIPPET = `import { WalletSection } from "@/modules/packages/dashboards/dashboard-v2/components/WalletSection";

<WalletSection
  wallet={data.wallet}
  isLoading={isLoading}
/>

// data.wallet estructura:
// {
//   balance: 180,
//   totalPurchased: 300,
//   expiresAt: "2027-01-18",
//   daysUntilExpiry: 270,
//   lowBalanceThreshold: 30,
//   expiryWarningDays: 30,
// }`;

function MiniWallet({ value, total, days }: { value: number; total: number; days: number | null }) {
  return (
    <div className="flex w-full flex-col items-center gap-2 rounded-md bg-primary p-3 text-primary-foreground">
      <div className="flex w-full items-center justify-between">
        <span className="text-[10px] font-semibold">Tu billetera</span>
        {days != null && (
          <span className="rounded-full bg-primary-foreground/10 px-1.5 py-0.5 text-[9px] font-tnum">
            {days}d
          </span>
        )}
      </div>
      <div className="relative">
        <MiniRing value={value} total={total} size={56} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base font-semibold leading-none font-tnum">{value}</span>
          <span className="text-[8px] text-primary-foreground/75">de {total}</span>
        </div>
      </div>
      <div className="w-full rounded bg-primary-foreground py-1 text-center text-[9px] font-medium text-primary">
        Recargar wallet
      </div>
    </div>
  );
}

const STATES = [
  { label: "healthy", className: ">30d", node: <MiniWallet value={180} total={300} days={270} /> },
  { label: "warning", className: "7-30d", node: <MiniWallet value={60} total={300} days={20} /> },
  { label: "critical", className: "<7d", node: <MiniWallet value={10} total={300} days={3} /> },
  {
    label: "loading",
    node: (
      <div className="flex w-full flex-col items-center gap-2 rounded-md bg-primary p-3">
        <div className="h-12 w-12 animate-pulse rounded-full bg-primary-foreground/20" />
        <div className="h-2 w-16 animate-pulse rounded bg-primary-foreground/20" />
      </div>
    ),
  },
  {
    label: "no-bag",
    node: (
      <div className="flex w-full flex-col items-center gap-2 rounded-md bg-primary p-3 text-primary-foreground">
        <MiniRing value={0} total={1} size={48} />
        <span className="text-[9px] text-primary-foreground/80">Sin bolsa activa</span>
        <ArrowRight className="h-3 w-3" aria-hidden="true" />
      </div>
    ),
  },
];

export function WalletSectionDoc() {
  return (
    <>
      <DSSectionHeader
        id="wallet-section"
        title={`Wallet Section — ${VERSION}`}
        status="stable"
        lastUpdate={TODAY}
        componentName="<WalletSection /> · <WalletProgressRing />"
      />
      <DSComponentSpec description="Hero card de la billetera del dashboard v2. Único color-block sólido (bg-primary) que muestra saldo, vigencia y CTA de recarga. Anillo SVG con saldo centrado." layout="split">
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <MiniWallet value={180} total={300} days={270} />
            <MiniWallet value={60} total={300} days={20} />
            <MiniWallet value={10} total={300} days={3} />
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
