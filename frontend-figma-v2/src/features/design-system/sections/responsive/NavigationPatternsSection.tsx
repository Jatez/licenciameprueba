import { DSSectionHeader } from "../../components/DSSectionHeader";
import { DSCrossRefBanner } from "../../components/DSCrossRefBanner";
import { CodeBlock, Subsection } from "./_shared";

const TODAY = "2026-04-23";

export function NavigationPatternsSection() {
  return (
    <>
      <DSSectionHeader
        id="responsive-navigation"
        title="Navigation patterns"
        status="stable"
        lastUpdate={TODAY}
      />
      <DSCrossRefBanner
        targetId="sidebar"
        targetLabel="Components / Sidebar"
        scope="cómo se transforma la navegación en mobile (hamburger drawer)"
      />
      <Subsection
        id="responsive-navigation-drawer"
        title="Sidebar → Hamburger drawer (< lg)"
        description="A partir del breakpoint lg el sidebar lateral está visible. Por debajo se reemplaza por un botón hamburguesa que abre un drawer lateral. El drawer cierra al tocar el backdrop, bloquea el scroll del body y debe tener un botón de cierre explícito."
      >
        <CodeBlock
          code={`// 1. Sidebar visible solo en lg+
<aside className="hidden lg:block fixed left-0 top-0 w-56 h-screen">
  …
</aside>

// 2. Hamburger button visible solo en < lg
<button
  className="lg:hidden fixed top-3 left-3 z-40 h-11 w-11 inline-flex items-center justify-center"
  aria-label="Abrir menú"
  onClick={() => setOpen(true)}
>
  <Menu className="h-5 w-5" />
</button>

// 3. Drawer (Radix Sheet) en mobile
<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent side="left" className="w-[85%] max-w-sm p-0 overflow-y-auto">
    {/* contenido del menú */}
  </SheetContent>
</Sheet>`}
        />
      </Subsection>

      <Subsection
        id="responsive-navigation-bodylock"
        title="Bloqueo del scroll del body"
        description="Cuando el drawer está abierto, evita que el scroll del fondo se mueva detrás."
      >
        <CodeBlock
          code={`useEffect(() => {
  if (!open) return;
  const prev = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  return () => { document.body.style.overflow = prev; };
}, [open]);`}
        />
      </Subsection>

      <Subsection
        id="responsive-navigation-files"
        title="Implementación de referencia"
        description="Componentes existentes en este proyecto — reutiliza, no recrees."
      >
        <ul className="text-sm text-foreground space-y-2 list-disc list-inside">
          <li><code className="text-xs bg-muted px-1 rounded">src/components/layout/AppMobileDrawer.tsx</code> — Drawer estándar de la app</li>
          <li><code className="text-xs bg-muted px-1 rounded">src/components/layout/BodyCard.tsx</code> — Wrapper que orquesta sidebar + hamburger</li>
          <li><code className="text-xs bg-muted px-1 rounded">src/components/ui/sheet.tsx</code> — Primitiva de drawer (Radix)</li>
        </ul>
      </Subsection>

      <Subsection
        id="responsive-navigation-topbar"
        title="Top bar con acciones que colapsan"
        description="Si el header tiene varias acciones, oculta los labels de texto en móvil dejando solo iconos. Usa hidden sm:inline para los textos."
      >
        <CodeBlock
          code={`<Button className="h-11">
  <Download className="h-4 w-4" />
  <span className="hidden sm:inline ml-2">Exportar</span>
</Button>`}
        />
      </Subsection>
    </>
  );
}
