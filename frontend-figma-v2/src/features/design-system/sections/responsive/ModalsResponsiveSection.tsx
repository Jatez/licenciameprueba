import { DSSectionHeader } from "../../components/DSSectionHeader";
import { CodeBlock, Subsection } from "./_shared";

const TODAY = "2026-04-23";

export function ModalsResponsiveSection() {
  return (
    <>
      <DSSectionHeader
        id="responsive-modals"
        title="Modals & dialogs"
        status="stable"
        lastUpdate={TODAY}
      />
      <Subsection
        id="responsive-modals-pattern"
        title="Full-screen en móvil, centrado en desktop"
        description="En < md el modal ocupa toda la pantalla (o se ancla al fondo como bottom-sheet). En md+ vuelve a ser un dialog centrado con max-width."
      >
        <CodeBlock
          code={`<DialogContent
  className="
    p-0
    w-full h-full max-w-none rounded-none
    md:h-auto md:max-w-lg md:rounded-card
    flex flex-col
  "
>
  <DialogHeader className="p-4 md:p-6 border-b border-border">
    <DialogTitle className="text-lg md:text-xl">Título</DialogTitle>
  </DialogHeader>

  <div className="flex-1 overflow-y-auto p-4 md:p-6">
    {/* contenido */}
  </div>

  <DialogFooter className="p-4 md:p-6 border-t border-border flex-col-reverse sm:flex-row gap-2">
    <Button variant="ghost" className="w-full sm:w-auto">Cancelar</Button>
    <Button className="w-full sm:w-auto">Confirmar</Button>
  </DialogFooter>
</DialogContent>`}
        />
      </Subsection>

      <Subsection
        id="responsive-modals-bottomsheet"
        title="Bottom sheet (alternativa móvil)"
        description="Para pickers, filtros y selección rápida. Usa Drawer (vaul) o un Sheet con side='bottom'."
      >
        <CodeBlock
          code={`<Sheet>
  <SheetTrigger asChild>
    <Button className="h-11 w-full md:w-auto">Abrir filtros</Button>
  </SheetTrigger>
  <SheetContent
    side="bottom"
    className="rounded-t-card max-h-[85dvh] overflow-y-auto"
  >
    {/* contenido */}
  </SheetContent>
</Sheet>`}
        />
      </Subsection>

      <Subsection
        id="responsive-modals-rules"
        title="Reglas adicionales"
      >
        <ul className="text-sm text-foreground space-y-2 list-disc list-inside max-w-3xl">
          <li>El botón de cierre debe ser visible sin necesidad de scroll.</li>
          <li>Header y footer fijos, contenido con <code className="text-xs bg-muted px-1 rounded">overflow-y-auto</code>.</li>
          <li>Bloquea el scroll del body mientras el modal está abierto (Radix Dialog ya lo hace).</li>
          <li>Botones del footer en columna invertida en móvil: el primario aparece arriba en móvil y a la derecha en desktop.</li>
        </ul>
      </Subsection>
    </>
  );
}
