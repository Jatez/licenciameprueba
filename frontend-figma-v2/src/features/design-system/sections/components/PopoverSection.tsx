import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
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

const POPOVER_ANATOMY = [
  { name: "PopoverTrigger", desc: "Botón o elemento que abre el popover. Usa asChild para portarlo a cualquier control." },
  { name: "PopoverContent", desc: "Capa flotante con bg-popover, border, shadow-md y animación de entrada/salida." },
  { name: "Arrow (opcional)", desc: "Flecha apuntando al trigger. No incluida por defecto en esta primitiva." },
];

const POPOVER_TOKENS = [
  "bg-popover text-popover-foreground",
  "border border-border rounded-md shadow-md",
  "z-50 (sobre cualquier card, debajo de modales)",
  "w-72 (default)",
  "p-4 (default)",
  "animate-in fade-in-0 zoom-in-95",
  "data-[side=*]:slide-in-from-* (per-side enter)",
];

const POPOVER_A11Y = [
  "Radix maneja focus trap y restauración del foco al cerrar.",
  "Soporta Escape para cerrar y click-outside.",
  "El trigger recibe aria-expanded automáticamente.",
  "Para menús contextuales (acciones), prefiere DropdownMenu — Popover es para contenido, no para listas de comandos.",
];

const POPOVER_DOS = [
  "Usar para pickers ligeros: filtros rápidos, color pickers, toggles temporales.",
  "Usar PopoverTrigger asChild para envolver botones del DS sin doble wrapper.",
  "Mantener el contenido <= 320px de ancho — si crece más, considera un Sheet o Dialog.",
  "Cerrar el popover con onOpenChange después de acciones destructivas o de confirmación.",
];

const POPOVER_DONTS = [
  "Usarlo como menú de comandos — para eso existe DropdownMenu.",
  "Anidar formularios largos dentro — usar Dialog o Sheet.",
  "Stackear múltiples popovers abiertos a la vez.",
  "Reemplazar Tooltip — el Tooltip es hover-only y sin foco persistente.",
];

const POPOVER_CODE = `import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline" size="sm">Filtros</Button>
  </PopoverTrigger>
  <PopoverContent className="w-72">
    {/* contenido del popover */}
  </PopoverContent>
</Popover>`;

export function PopoverSection() {
  return (
    <>
      <DSSectionHeader
        id="popover"
        title="Popover"
        status="stable"
        lastUpdate={TODAY}
        componentName="<Popover /> · <PopoverTrigger /> · <PopoverContent />"
      />
      <DSComponentSpec
        description="Capa flotante anclada a un trigger. Para contenido contextual ligero (pickers, mini-formularios, vistas previas). Para listas de acciones usa DropdownMenu; para hover sin interacción usa Tooltip."
        layout="split"
      >
        <DSSectionBody
          layout="split"
          left={
            <>
              <DSAnatomy parts={POPOVER_ANATOMY} />
              <DSUsage dos={POPOVER_DOS} donts={POPOVER_DONTS} />
              <DSCollapsibleA11y items={POPOVER_A11Y} />
              <DSCollapsibleTokens tokens={POPOVER_TOKENS} />
            </>
          }
          right={
            <>
              <DSVariants>
                <div className="space-y-6">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Default
                    </p>
                    <div className="flex items-center gap-4 rounded-card border border-border bg-card p-6">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm">
                            Abrir popover
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-72">
                          <p className="text-sm font-semibold text-foreground">Título</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Contenido contextual ligero anclado al trigger.
                          </p>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </DSVariants>

              <DSStates
                states={[
                  {
                    label: "Closed",
                    node: (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm">
                            Cerrado
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56">
                          <p className="text-sm">Click en el trigger para abrir.</p>
                        </PopoverContent>
                      </Popover>
                    ),
                  },
                  {
                    label: "Open (default)",
                    node: (
                      <Popover defaultOpen>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm">
                            Abierto
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56">
                          <p className="text-sm">Estado open por defecto.</p>
                        </PopoverContent>
                      </Popover>
                    ),
                  },
                ]}
              />

              <DSCode snippet={POPOVER_CODE} collapsedByDefault />
            </>
          }
        />
      </DSComponentSpec>
    </>
  );
}
