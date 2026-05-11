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

const ANATOMY = [
  { name: "wrapper", desc: "<main> con margin 10px en todos los lados (m-[0.625rem]) y altura calc(100dvh - 1.25rem)." },
  { name: "surface", desc: "bg-bodycard-bg (#F3F4F6) + rounded-card (20px) — define el 'card flotante'." },
  { name: "scroll-area", desc: "overflow-y-auto + scrollbar-minimal — el ÚNICO scroll vertical de la app." },
  { name: "padding", desc: "px-4 pt-14 pb-6 en mobile · md:px-10 md:py-12 en desktop." },
  { name: "sidebar-offset", desc: "md:ml-[calc(13.1875rem+0.625rem)] reserva el espacio del AppSidebar fijo." },
  { name: "mobile-menu-slot", desc: "Botón hamburguesa fixed top-right (z-40), oculto en md+." },
  { name: "bottom-inset", desc: "padding-bottom dinámico cuando PersistentPlayer está visible." },
];

const A11Y = [
  "Elemento <main> — landmark principal de la página (un solo main por documento).",
  "scrollbar-minimal mantiene el scroll visible y operable con teclado y trackpad.",
  "El botón de menú móvil tiene aria-label 'Open menu' y un touch target de 40×40 (cumple AA).",
  "padding-bottom dinámico evita que el PersistentPlayer cubra el último row de contenido.",
];

const DOS = [
  "Usa BodyCard exactamente una vez dentro de PageShell.",
  "Pasa `bottomInset={playerHeight}` cuando el PersistentPlayer pueda estar visible.",
  "Coloca todo el scroll de la app aquí — no en hijos.",
  "Para la versión mobile, pasa el botón hamburguesa via prop `mobileMenuButton`.",
];

const DONTS = [
  "No anides otro overflow-y-auto dentro — rompe el scroll continuo.",
  "No alteres el margin de 10px (`m-[0.625rem]`) — es la decisión visual clave del shell.",
  "No cambies el border-radius — usa `rounded-card` (20px) por consistencia con AppSidebar.",
  "No quites el sidebar-offset en md+ — el AppSidebar es position: fixed y se solaparía.",
];

const CODE = `import { BodyCard } from "@/shared/components/layout";
import { usePlayerVisibleHeight } from "@/modules/packages/player";

export function AppLayout() {
  const playerHeight = usePlayerVisibleHeight();

  return (
    <PageShell>
      <AppSidebar />
      <BodyCard
        bottomInset={playerHeight}
        mobileMenuButton={
          <button onClick={openDrawer} aria-label="Open menu">
            <Menu size={20} />
          </button>
        }
      >
        <Outlet />
      </BodyCard>
    </PageShell>
  );
}`;

function BodyCardMock({
  padding = "default",
  fullWidth = false,
}: {
  padding?: "default" | "sm" | "none";
  fullWidth?: boolean;
}) {
  const padClass = padding === "default" ? "p-4" : padding === "sm" ? "p-2" : "";
  return (
    <div className="bg-sidebar-bg rounded-card p-2.5 h-40 relative">
      <div
        className={`bg-bodycard-bg rounded-[14px] h-full ${padClass} ${fullWidth ? "" : "ml-12"}`}
      >
        <div className="h-full w-full bg-muted/40 rounded-md flex items-center justify-center">
          <span className="text-xs text-muted-foreground">content · padding={padding}</span>
        </div>
      </div>
      {!fullWidth && (
        <div className="absolute left-2.5 top-2.5 bottom-2.5 w-10 rounded-l-[14px] border border-dashed border-ink-700/30 flex items-center justify-center">
          <span className="rotate-180 [writing-mode:vertical-rl] text-[9px] text-muted-foreground">sidebar offset</span>
        </div>
      )}
    </div>
  );
}

export function BodyCardSection() {
  return (
    <>
      <DSSectionHeader
        id="body-card"
        title="BodyCard"
        status="stable"
        lastUpdate={TODAY}
        componentName="<BodyCard />"
      />
      <DSComponentSpec
        description="Contenedor flotante del contenido principal. Crea el 'floating card' característico del producto: 10px de margen en los 4 lados, esquinas redondeadas (20px) y un único scroll vertical. Reserva espacio para el AppSidebar fijo en desktop y para el PersistentPlayer cuando aparece."
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
                  "bg-bodycard-bg (#F3F4F6 · TODO migrar a HSL en Prompt 6)",
                  "rounded-card (20px)",
                  "m-[0.625rem] (= 10px en los 4 lados — decisión clave)",
                  "h-[calc(100dvh-1.25rem)]",
                  "px-4 pt-14 pb-6  ·  md:px-10 md:py-12",
                  "md:ml-[calc(13.1875rem+0.625rem)] (sidebar offset)",
                  "scrollbar-minimal",
                  "bottomInset prop → padding-bottom dinámico",
                ]}
              />
            </>
          }
          right={
            <>
              <DSVariants>
                <div className="space-y-5">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Padding default (px-10 py-12)
                    </p>
                    <BodyCardMock padding="default" />
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Padding sm (uso interno: drawers)
                    </p>
                    <BodyCardMock padding="sm" />
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Padding none (HorizontalScroller, mapas)
                    </p>
                    <BodyCardMock padding="none" />
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Full-width (sin sidebar offset · uso futuro)
                    </p>
                    <BodyCardMock padding="default" fullWidth />
                  </div>
                </div>
              </DSVariants>

              <DSStates
                states={[
                  {
                    label: "Default",
                    node: <BodyCardMock />,
                  },
                  {
                    label: "Scrollable (sombra sutil al scrollear)",
                    node: (
                      <div className="bg-sidebar-bg rounded-card p-2.5 h-40 relative">
                        <div className="bg-bodycard-bg rounded-[14px] h-full ml-12 overflow-hidden">
                          <div className="h-3 bg-gradient-to-b from-black/5 to-transparent" />
                          <div className="p-3 text-xs text-muted-foreground">scroll → top fade</div>
                        </div>
                      </div>
                    ),
                  },
                ]}
              />

              <DSCode snippet={CODE} collapsedByDefault />
            </>
          }
        />
      </DSComponentSpec>
    </>
  );
}
