import { DSSectionHeader } from "../../components/DSSectionHeader";
import { DSSectionBody } from "../../components/DSSectionBody";
import {
  DSComponentSpec,
  DSAnatomy,
  DSVariants,
  DSCode,
  DSCollapsibleA11y,
  DSCollapsibleTokens,
  DSUsage,
} from "../../components/spec";

const TODAY = "2026-04-24";

const ANATOMY = [
  { name: "viewport", desc: "<div> 100dvh, overflow-hidden — único punto del DOM que pinta el fondo de la app." },
  { name: "background", desc: "bg-sidebar-bg (#EAEAEB) — el 'margen' visible alrededor del BodyCard flotante." },
  { name: "children", desc: "Slot único: AppSidebar + AppMobileDrawer + BodyCard + PersistentPlayer." },
];

const A11Y = [
  "No interactivo: PageShell es puramente estructural, no introduce roles ARIA propios.",
  "Garantiza overflow-hidden en el root para que sólo BodyCard tenga scroll vertical.",
  "h-[100dvh] usa dynamic viewport height para acomodar barras de navegación móvil.",
];

const DOS = [
  "Usa <PageShell> una sola vez por route tree (en AppLayout).",
  "Mantén el background aquí, no en <body> — facilita transiciones futuras de tema.",
  "Renderiza siempre BodyCard como hijo directo o último descendiente con scroll propio.",
];

const DONTS = [
  "No añadas padding al PageShell — el spacing entre el card y el borde lo aporta el `m-[0.625rem]` del BodyCard.",
  "No le pongas overflow-y-auto: el scroll vive dentro de BodyCard.",
  "No instancies más de uno por página — rompe el cálculo de 100dvh.",
];

const CODE = `import { PageShell } from "@/shared/components/layout";

export function AppLayout() {
  return (
    <PageShell>
      <AppSidebar />
      <BodyCard>
        <Outlet />
      </BodyCard>
      <PersistentPlayer />
    </PageShell>
  );
}`;

function PageShellMock() {
  return (
    <div className="rounded-card border border-border overflow-hidden">
      <div className="bg-sidebar-bg p-3 h-48 relative">
        <div className="absolute inset-3 rounded-[18px] bg-bodycard-bg flex items-center justify-center">
          <span className="text-xs text-muted-foreground">BodyCard children</span>
        </div>
        <span className="absolute top-1 left-2 text-[10px] font-mono text-ink-700/70">bg-sidebar-bg · 100dvh</span>
      </div>
    </div>
  );
}

export function PageShellSection() {
  return (
    <>
      <DSSectionHeader
        id="page-shell"
        title="PageShell"
        status="stable"
        lastUpdate={TODAY}
        componentName="<PageShell />"
      />
      <DSComponentSpec
        description="Wrapper raíz de la app autenticada. Define el canvas de fondo (bg-sidebar-bg) sobre el que flota el BodyCard. Es el único punto donde se controla el color del 'margen' alrededor del card."
        layout="split"
      >
        <DSSectionBody
          layout="split"
          left={
            <>
              <DSAnatomy parts={ANATOMY} />
              <DSUsage dos={DOS} donts={DONTS} />
              <DSCollapsibleA11y items={A11Y} />
              <DSCollapsibleTokens
                tokens={[
                  "bg-sidebar-bg (#EAEAEB · TODO migrar a HSL en Prompt 6)",
                  "h-[100dvh] (dynamic viewport height)",
                  "overflow-hidden",
                ]}
              />
            </>
          }
          right={
            <>
              <DSVariants>
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Default — único variante
                  </p>
                  <PageShellMock />
                </div>
              </DSVariants>
              <DSCode snippet={CODE} collapsedByDefault />
            </>
          }
        />
      </DSComponentSpec>
    </>
  );
}
