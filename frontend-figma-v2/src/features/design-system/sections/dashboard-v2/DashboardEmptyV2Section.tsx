import { CreditCard, Library, Link2 } from "lucide-react";
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
  { name: "Greeting", desc: "Saludo personalizado con companyName + título grande + subtítulo descriptivo." },
  { name: "StepsGrid", desc: "Grid 1/3 columnas con 3 cards de onboarding (Comprar / Explorar / Conectar)." },
  { name: "StepCard", desc: "Card light con icon-bubble (bg-metric-subtle/[0.63]) + título + descripción + CTA." },
  { name: "PrimaryStep", desc: "El primer step usa Button variant='default'; los otros 'outline'." },
];

const TOKENS = [
  "py-8",
  "text-2xl / lg:text-3xl (title)",
  "text-sm text-muted-foreground (greeting / subtitle)",
  "max-w-4xl (steps grid)",
  "h-10 w-10 rounded-lg (icon bubble)",
  "bg-metric-subtle/[0.63]",
  "text-metric (icon)",
];

const A11Y = [
  "Estructura semántica: <section> + <h1> + <h2> por step.",
  "Greeting interpola companyName con la utilidad fmt() de strings.ts (sin XSS).",
  "Cada CTA es un Button con texto descriptivo (no 'Click aquí').",
  "Iconos decorativos con aria-hidden — el step ya tiene título.",
  "Layout adapta a 1 columna en mobile preservando el orden lógico.",
];

const DOS = [
  "Activarlo cuando wallet.balance === 0 && licenseSummary.totalIssuedInPeriod === 0 && recentActivity.length === 0.",
  "Combinarlo con un greeting personalizado para usuarios sin actividad reciente.",
  "Mantener exactamente 3 steps — el patrón clásico de empty state guiado.",
  "Personalizar el greeting con el primer nombre del usuario (no email).",
];

const DONTS = [
  "Mostrarlo cuando hay aunque sea 1 evento — usa el dashboard normal con sus skeletons.",
  "Aumentar a 4+ steps — fragmenta la decisión inicial.",
  "Sustituir las cards por un wizard a pantalla completa — bloquea el descubrimiento.",
  "Repetir el saludo en cada visita — solo cuando no hay actividad.",
];

const SNIPPET = `import { DashboardEmptyStateV2 } from "@/modules/packages/dashboards/dashboard-v2/components/DashboardEmptyStateV2";

const isNewCompany =
  data &&
  data.wallet.balance === 0 &&
  data.licenseSummary.totalIssuedInPeriod === 0 &&
  data.recentActivity.length === 0;

if (isNewCompany) {
  return <DashboardEmptyStateV2 companyName={user?.fullName?.split(" ")[0] ?? "equipo"} />;
}`;

function MiniStep({ Icon, title, primary = false }: { Icon: typeof CreditCard; title: string; primary?: boolean }) {
  return (
    <div className="flex flex-col items-start gap-1.5 rounded-md border border-border bg-card p-2">
      <div className="flex h-6 w-6 items-center justify-center rounded bg-metric-subtle/[0.63]">
        <Icon className="h-3 w-3 text-metric" aria-hidden="true" />
      </div>
      <p className="text-[10px] font-semibold text-foreground">{title}</p>
      <p className="text-[9px] text-muted-foreground">Lorem ipsum dolor sit amet</p>
      <div
        className={`mt-1 w-full rounded py-1 text-center text-[9px] font-medium ${
          primary
            ? "bg-foreground text-background"
            : "border border-border bg-card text-foreground"
        }`}
      >
        Acción
      </div>
    </div>
  );
}

const STATES = [
  {
    label: "default",
    node: (
      <div className="grid w-full grid-cols-3 gap-1.5">
        <MiniStep Icon={CreditCard} title="Comprar" primary />
        <MiniStep Icon={Library} title="Explorar" />
        <MiniStep Icon={Link2} title="Conectar" />
      </div>
    ),
  },
  {
    label: "mobile (1 col)",
    node: (
      <div className="flex w-full flex-col gap-1.5">
        <MiniStep Icon={CreditCard} title="Comprar" primary />
        <MiniStep Icon={Library} title="Explorar" />
      </div>
    ),
  },
];

export function DashboardEmptyV2Section() {
  return (
    <>
      <DSSectionHeader
        id="dashboard-empty-v2"
        title={`Dashboard Empty State — ${VERSION}`}
        status="stable"
        lastUpdate={TODAY}
        componentName="<DashboardEmptyStateV2 />"
      />
      <DSComponentSpec description="Vista de bienvenida cuando la empresa aún no tiene actividad (wallet en cero, sin licencias ni eventos). Reemplaza el dashboard completo con greeting personalizado + 3 acciones guiadas." layout="split">
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
          <div className="max-w-md">
            <p className="mb-2 text-center text-[10px] text-muted-foreground">Hola, equipo demo</p>
            <p className="mb-3 text-center text-sm font-semibold text-foreground">Configura tu cuenta en 3 pasos</p>
            <div className="grid grid-cols-3 gap-2">
              <MiniStep Icon={CreditCard} title="Comprar" primary />
              <MiniStep Icon={Library} title="Explorar" />
              <MiniStep Icon={Link2} title="Conectar" />
            </div>
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
