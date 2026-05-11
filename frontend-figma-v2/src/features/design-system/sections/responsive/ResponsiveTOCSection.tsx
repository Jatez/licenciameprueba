import { DSSectionHeader } from "../../components/DSSectionHeader";

const TODAY = "2026-04-23";

const TOC_ITEMS = [
  { id: "responsive-breakpoints", label: "Breakpoints" },
  { id: "responsive-layouts", label: "Layout patterns" },
  { id: "responsive-typography", label: "Typography scale" },
  { id: "responsive-spacing", label: "Spacing system" },
  { id: "responsive-touch", label: "Touch targets" },
  { id: "responsive-navigation", label: "Navigation patterns" },
  { id: "responsive-forms", label: "Forms on mobile" },
  { id: "responsive-tables", label: "Tables & data" },
  { id: "responsive-modals", label: "Modals & dialogs" },
  { id: "responsive-checklist", label: "Build checklist" },
];

export function ResponsiveTOCSection() {
  return (
    <>
      <DSSectionHeader
        id="responsive-overview"
        title="Responsive & Mobile"
        status="stable"
        lastUpdate={TODAY}
      />
      <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl mb-4">
        Fuente única de verdad para diseño responsive en Licénciame. Toda nueva pantalla
        debe construirse <strong>mobile-first</strong> siguiendo estos patrones: estilos por
        defecto para móvil y escalado progresivo con prefijos <code className="bg-muted px-1 rounded text-xs">sm:</code>, <code className="bg-muted px-1 rounded text-xs">md:</code>, <code className="bg-muted px-1 rounded text-xs">lg:</code>.
      </p>
      <nav aria-label="Tabla de contenidos responsive" className="bg-card border border-border rounded-card p-4 mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          En esta sección
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {TOC_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="text-sm text-foreground hover:text-primary hover:underline transition-colors"
              >
                → {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
