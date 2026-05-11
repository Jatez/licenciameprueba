import { Heart, Trash2, Check, X } from "lucide-react";
import { DSSectionHeader } from "../../components/DSSectionHeader";
import { CodeBlock, Subsection, PreviewBox } from "./_shared";

const TODAY = "2026-04-23";

export function TouchTargetsSection() {
  return (
    <>
      <DSSectionHeader
        id="responsive-touch"
        title="Touch targets"
        status="stable"
        lastUpdate={TODAY}
      />
      <Subsection
        id="responsive-touch-rules"
        title="Tamaño mínimo y separación"
        description="Apple HIG / WCAG: mínimo 40×40px (h-10 w-10), preferido 44×44px (h-11 w-11). Deja al menos 8px entre elementos interactivos para evitar taps accidentales."
      >
        <div className="bg-card rounded-card border border-border overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="text-left p-3 font-semibold">Elemento</th>
                <th className="text-left p-3 font-semibold">Mínimo</th>
                <th className="text-left p-3 font-semibold">Clase Tailwind</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border">
                <td className="p-3 font-medium">Icon button</td>
                <td className="p-3 text-muted-foreground">40×40 (preferido 44×44)</td>
                <td className="p-3"><code className="text-xs bg-muted px-1 rounded">h-10 w-10</code> / <code className="text-xs bg-muted px-1 rounded">h-11 w-11</code></td>
              </tr>
              <tr className="border-t border-border">
                <td className="p-3 font-medium">Botón primario móvil</td>
                <td className="p-3 text-muted-foreground">altura 44px, ancho completo</td>
                <td className="p-3"><code className="text-xs bg-muted px-1 rounded">h-11 w-full sm:w-auto</code></td>
              </tr>
              <tr className="border-t border-border">
                <td className="p-3 font-medium">Item de lista</td>
                <td className="p-3 text-muted-foreground">altura 44px</td>
                <td className="p-3"><code className="text-xs bg-muted px-1 rounded">min-h-[44px]</code></td>
              </tr>
              <tr className="border-t border-border">
                <td className="p-3 font-medium">Separación entre tappables</td>
                <td className="p-3 text-muted-foreground">8px mínimo</td>
                <td className="p-3"><code className="text-xs bg-muted px-1 rounded">gap-2</code> o más</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Subsection>

      <Subsection
        id="responsive-touch-examples"
        title="Correcto vs incorrecto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PreviewBox>
            <p className="text-xs font-semibold uppercase tracking-wider text-success mb-3">
              ✓ Correcto — h-11 con gap-2
            </p>
            <div className="flex items-center gap-2">
              <button className="h-11 w-11 inline-flex items-center justify-center rounded-md bg-muted hover:bg-muted/70" aria-label="Like">
                <Heart className="h-4 w-4" />
              </button>
              <button className="h-11 w-11 inline-flex items-center justify-center rounded-md bg-muted hover:bg-muted/70" aria-label="Confirmar">
                <Check className="h-4 w-4" />
              </button>
              <button className="h-11 w-11 inline-flex items-center justify-center rounded-md bg-muted hover:bg-muted/70" aria-label="Cancelar">
                <X className="h-4 w-4" />
              </button>
              <button className="h-11 w-11 inline-flex items-center justify-center rounded-md bg-muted hover:bg-muted/70" aria-label="Eliminar">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </PreviewBox>
          <PreviewBox>
            <p className="text-xs font-semibold uppercase tracking-wider text-error mb-3">
              ✗ Incorrecto — h-6 sin gap
            </p>
            <div className="flex items-center gap-0">
              <button className="h-6 w-6 inline-flex items-center justify-center rounded bg-muted" aria-label="Like">
                <Heart className="h-3 w-3" />
              </button>
              <button className="h-6 w-6 inline-flex items-center justify-center rounded bg-muted" aria-label="Confirmar">
                <Check className="h-3 w-3" />
              </button>
              <button className="h-6 w-6 inline-flex items-center justify-center rounded bg-muted" aria-label="Cancelar">
                <X className="h-3 w-3" />
              </button>
              <button className="h-6 w-6 inline-flex items-center justify-center rounded bg-muted" aria-label="Eliminar">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </PreviewBox>
        </div>
        <CodeBlock
          code={`// ✅
<button className="h-11 w-11 inline-flex items-center justify-center rounded-md" aria-label="…">
  <Icon className="h-4 w-4" />
</button>

// ✅ CTA primario móvil
<Button className="h-11 w-full sm:w-auto">Continuar</Button>`}
        />
      </Subsection>

      <Subsection
        id="responsive-touch-no-hover"
        title="Sin interacciones solo-hover"
        description="En móvil no existe hover. Toda acción accesible vía hover debe tener equivalente táctil (tap, long-press, menú visible)."
      >
        <CodeBlock
          code={`// ❌ Solo se ve al hacer hover — invisible en móvil
<div className="group">
  <button className="opacity-0 group-hover:opacity-100">Acciones</button>
</div>

// ✅ Visible siempre o con menú accesible
<DropdownMenu>
  <DropdownMenuTrigger className="h-11 w-11" aria-label="Acciones">⋯</DropdownMenuTrigger>
  …
</DropdownMenu>`}
        />
      </Subsection>
    </>
  );
}
