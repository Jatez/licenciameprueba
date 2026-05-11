import { DSSectionHeader } from "../../components/DSSectionHeader";
import { DSSectionBody } from "../../components/DSSectionBody";
import {
  DSComponentSpec,
  DSAnatomy,
  DSVariants,
  DSCode,
  DSCollapsibleA11y,
  DSUsage,
} from "../../components/spec";

const TODAY = "2026-04-24";

const ANATOMY = [
  { name: "PageShell", desc: "Wrapper raíz · pinta el fondo bg-sidebar-bg." },
  { name: "AppSidebar", desc: "Navegación lateral fija (211px, desktop) con material frosted." },
  { name: "AppMobileDrawer", desc: "Drawer overlay (mobile) con la misma navegación." },
  { name: "BodyCard", desc: "Card flotante que contiene <Outlet /> · único scroll vertical." },
  { name: "PersistentPlayer", desc: "Reproductor global fijo (z-40) · empuja el padding-bottom de BodyCard." },
  { name: "DetectionToastsContainer", desc: "Toasts de tracking events (top-right)." },
  { name: "DevTrackingTrigger", desc: "Trigger del panel dev (sólo en DEV builds)." },
];

const A11Y = [
  "<main> proviene del BodyCard — un único landmark principal por página.",
  "El AppMobileDrawer atrapa el foco mientras está abierto y se cierra con Escape.",
  "El PersistentPlayer tiene su propio role='region' con aria-label='Reproductor de música'.",
  "Los toasts usan role='status' o 'alert' según severidad.",
];

const DOS = [
  "Usa AppLayout como element de la ruta padre `/dashboard03` y descendientes.",
  "Mount-once: useSyncPlayerWithEngine, usePlayerKeyboardShortcuts, useTrackingEvents.",
  "Las páginas son thin: sólo renderizan features, sin tocar el shell.",
];

const DONTS = [
  "No reimplementes el shell por feature — extiende AppLayout o crea un layout-route hermano.",
  "No montes <PersistentPlayer /> en una página — es responsabilidad del shell.",
  "No bypass-ees BodyCard con un wrapper propio — pierdes el padding-bottom dinámico.",
];

const CODE = `import { AppLayout } from "@/shared/components/layout";

// router setup
<Route element={<AppLayout />}>
  <Route path="/dashboard03" element={<Dashboard03 />} />
  <Route path="/catalog" element={<Catalog />} />
  <Route path="/wallet" element={<WalletCheckout />} />
  {/* …todas las rutas autenticadas */}
</Route>`;

function CompositionDiagram() {
  return (
    <div className="rounded-card border border-border bg-card p-4">
      <div className="rounded-[14px] bg-sidebar-bg p-3 relative">
        <div className="text-[10px] font-mono text-ink-700/80 mb-2">PageShell · bg-sidebar-bg · 100dvh</div>
        <div className="grid grid-cols-[88px_1fr] gap-2">
          <div className="rounded-[10px] bg-card/70 backdrop-blur-sm border border-border p-2 text-[10px]">
            <div className="font-semibold mb-1">AppSidebar</div>
            <div className="text-muted-foreground">211px · z-50 · frosted</div>
          </div>
          <div className="rounded-[10px] bg-bodycard-bg border border-border p-3 min-h-32 relative">
            <div className="text-[10px] font-mono text-muted-foreground mb-2">BodyCard · bg-bodycard-bg · scroll</div>
            <div className="rounded-md bg-muted/50 h-16 flex items-center justify-center text-[10px] text-muted-foreground">
              &lt;Outlet /&gt; — feature page
            </div>
            <div className="absolute left-2 right-2 bottom-1.5 rounded-md bg-card/95 border border-border h-6 flex items-center px-2 text-[10px] text-muted-foreground">
              PersistentPlayer · z-40 · pushes bottomInset
            </div>
          </div>
        </div>
        <div className="mt-2 flex gap-2 text-[10px] text-muted-foreground">
          <span className="px-1.5 py-0.5 rounded bg-muted">DetectionToasts</span>
          <span className="px-1.5 py-0.5 rounded bg-muted">DevTrackingTrigger (DEV only)</span>
        </div>
      </div>
    </div>
  );
}

export function AppLayoutSection() {
  return (
    <>
      <DSSectionHeader
        id="app-layout"
        title="AppLayout (pattern)"
        status="stable"
        lastUpdate={TODAY}
        componentName="<AppLayout />"
      />
      <DSComponentSpec
        description="Composición canónica del shell autenticado: PageShell + AppSidebar + AppMobileDrawer + BodyCard + PersistentPlayer + tracking. Es un patrón más que un componente atómico — orquesta los demás. Las rutas autenticadas se montan como hijos vía <Outlet />."
        layout="split"
      >
        <DSSectionBody
          layout="split"
          left={
            <>
              <DSAnatomy parts={ANATOMY} />
              <DSUsage dos={DOS} donts={DONTS} />
              <DSCollapsibleA11y items={A11Y} />
            </>
          }
          right={
            <>
              <DSVariants>
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Diagrama de composición
                  </p>
                  <CompositionDiagram />
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
