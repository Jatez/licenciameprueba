import {
  BookOpen,
  CreditCard,
  FileText,
  FolderKanban,
  LayoutDashboard,
  List,
  Music,
  Radar,
  Settings,
  Share2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SidebarShell } from "@/shared/components/sidebar/SidebarShell";
import { SidebarLogo } from "@/shared/components/sidebar/SidebarLogo";
import { SidebarNav, type SidebarNavEntry } from "@/shared/components/sidebar/SidebarNav";
import { SidebarUser } from "@/shared/components/sidebar/SidebarUser";
import { SidebarNavItem } from "@/shared/components/sidebar/SidebarNavItem";
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

const NAV_ITEMS: SidebarNavEntry[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "#", active: true },
  { icon: Music, label: "Explorar música", href: "#" },
  { icon: FolderKanban, label: "Proyectos", href: "#" },
  { icon: FileText, label: "Licencias", href: "#" },
  { icon: Radar, label: "Monitoreo", href: "#", badgeCount: 3 },
  { icon: List, label: "Shortlists", href: "#" },
  { icon: CreditCard, label: "Créditos", href: "#" },
  { icon: Share2, label: "Redes sociales", href: "#" },
  { icon: Settings, label: "Configuración", href: "#" },
  { icon: BookOpen, label: "Design System", href: "#" },
];

const SIDEBAR_ANATOMY = [
  { name: "AppSidebar", desc: "Composer de producción — orquesta los 5 sub-componentes." },
  { name: "SidebarShell", desc: "Contenedor frosted glass de 211px (z-50, blur 60px)." },
  { name: "SidebarLogo", desc: "Bloque superior con isotipo de Licénciame (h-7)." },
  { name: "SidebarNav", desc: "Lista vertical de SidebarNavItem." },
  { name: "SidebarNavItem", desc: "Ítem con icono + label + badgeCount opcional + estados active/hover." },
  { name: "SidebarUser", desc: "Pill inferior con avatar (iniciales), nombre y rol." },
];

const SIDEBAR_A11Y = [
  '<aside> + <nav aria-label="Navegación principal">.',
  'Ítem activo expone aria-current="page".',
  "Navegación por teclado: Tab entre ítems, Enter activa la ruta.",
  "Focus visible (ring-2 ring-primary) en cada NavItem.",
  "Avatar acepta fallback a iniciales cuando no hay foto disponible.",
  "Respeta prefers-reduced-transparency con fallback a sólido del shell.",
];

const SIDEBAR_DOS = [
  "Mantener un único <AppSidebar /> en el shell desktop (≥md).",
  "Renderizar el <AppMobileDrawer /> equivalente en mobile (oculto en md+).",
  "Ordenar items por frecuencia de uso (Dashboard, Catálogo, Licencias arriba).",
  "Usar badgeCount sólo para contadores que requieren acción del usuario.",
];

const SIDEBAR_DONTS = [
  "Importar el shadcn @/components/ui/sidebar — está deprecated, no se usa.",
  "Anidar más de un nivel de navegación.",
  "Usar el sidebar para acciones puntuales (eso son botones).",
  "Reducir el ancho por debajo de 200px (rompe el pill activo).",
];

const SIDEBAR_CODE = `import { AppSidebar } from "@/shared/components/layout/AppSidebar";

// Production composition (already done by AppLayout):
<div className="hidden md:block">
  <AppSidebar />
</div>

// Manual composition for special pages:
import { SidebarShell, SidebarLogo, SidebarNav, SidebarUser } from "@/shared/components/sidebar";

<SidebarShell variant="fixed">
  <SidebarLogo />
  <SidebarNav items={navItems} />
  <SidebarUser initials="MG" name="María Gómez" role="Brand Manager" />
</SidebarShell>`;

interface NavRowEntry {
  label: string;
  route: string;
  status: "live" | "todo";
}

const REAL_NAV_ROWS: NavRowEntry[] = [
  { label: "Dashboard", route: "/dashboard03", status: "live" },
  { label: "Explorar música", route: "/catalog", status: "live" },
  { label: "Proyectos", route: "—", status: "todo" },
  { label: "Licencias", route: "/licenses", status: "live" },
  { label: "Monitoreo", route: "/monitoring", status: "live" },
  { label: "Shortlists", route: "—", status: "todo" },
  { label: "Créditos", route: "/packages", status: "live" },
  { label: "Redes sociales", route: "/social", status: "live" },
  { label: "Configuración", route: "—", status: "todo" },
  { label: "Design System", route: "/design-system", status: "live" },
];

function RealNavTable() {
  return (
    <div className="rounded-card border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr className="text-left">
            <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Label
            </th>
            <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Ruta
            </th>
            <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Estado
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {REAL_NAV_ROWS.map((row) => (
            <tr key={row.label}>
              <td className="px-3 py-2 text-foreground">{row.label}</td>
              <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{row.route}</td>
              <td className="px-3 py-2">
                {row.status === "live" ? (
                  <Badge variant="vigente" className="text-[10px]">live</Badge>
                ) : (
                  <Badge variant="pendiente" className="text-[10px]">TODO</Badge>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SidebarSection() {
  return (
    <>
      <DSSectionHeader
        id="sidebar"
        title="Sidebar"
        status="stable"
        lastUpdate={TODAY}
        componentName="<AppSidebar /> · <SidebarShell /> · <SidebarLogo /> · <SidebarNav /> · <SidebarNavItem /> · <SidebarUser />"
      />
      <DSComponentSpec
        description="Navegación primaria del dashboard. Frosted glass fijo a la izquierda (211px, z-50) que persiste entre rutas. La composición real vive en @/shared/components/layout/AppSidebar y NO debe confundirse con la primitiva shadcn (deprecated)."
        layout="split"
      >
        <DSSectionBody
          layout="split"
          left={
            <>
              <DSAnatomy parts={SIDEBAR_ANATOMY} />
              <DSUsage dos={SIDEBAR_DOS} donts={SIDEBAR_DONTS} />
              <DSCollapsibleA11y items={SIDEBAR_A11Y} />
              <DSCollapsibleTokens
                tokens={[
                  "rgba(234, 234, 235, 0.6)",
                  "blur(60px)",
                  "13.1875rem (211px width)",
                  "100vh (variant=fixed)",
                  "z-50",
                  "#DBEC62 (active pill bg)",
                  "rounded-r-full (active pill)",
                  "#050505 (text default)",
                  "#050505 @ 60% (text inactive)",
                ]}
              />
            </>
          }
          right={
            <>
              <DSVariants>
                <div className="space-y-6">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Live preview
                    </p>
                    <div
                      className="relative h-[480px] rounded-xl overflow-hidden border border-border"
                      style={{ background: "#F2F4F7" }}
                    >
                      <div className="absolute inset-0 flex items-center justify-end pr-6">
                        <div className="grid grid-cols-2 gap-3">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className="w-24 h-24 rounded-xl"
                              style={{
                                background: `linear-gradient(135deg, hsl(${i * 60} 70% 60%), hsl(${i * 60 + 30} 70% 50%))`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      <SidebarShell variant="static">
                        <SidebarLogo />
                        <SidebarNav items={NAV_ITEMS} />
                        <SidebarUser initials="MG" name="María Gómez" role="Brand Manager" />
                      </SidebarShell>
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Entradas reales en producción (AppSidebar)
                    </p>
                    <RealNavTable />
                  </div>
                </div>
              </DSVariants>

              <DSStates
                states={[
                  {
                    label: "NavItem · active",
                    node: (
                      <div
                        style={{ width: "13rem", background: "rgba(234,234,235,0.6)", backdropFilter: "blur(60px)" }}
                        className="rounded-xl p-2 pr-3"
                      >
                        <SidebarNavItem icon={LayoutDashboard} label="Dashboard" href="#" forceState="active" />
                      </div>
                    ),
                  },
                  {
                    label: "NavItem · default",
                    node: (
                      <div
                        style={{ width: "13rem", background: "rgba(234,234,235,0.6)", backdropFilter: "blur(60px)" }}
                        className="rounded-xl p-2 pr-3"
                      >
                        <SidebarNavItem icon={Music} label="Música" href="#" forceState="default" />
                      </div>
                    ),
                  },
                  {
                    label: "NavItem · hover",
                    node: (
                      <div
                        style={{ width: "13rem", background: "rgba(234,234,235,0.6)", backdropFilter: "blur(60px)" }}
                        className="rounded-xl p-2 pr-3"
                      >
                        <SidebarNavItem icon={FolderKanban} label="Proyectos" href="#" forceState="hover" />
                      </div>
                    ),
                  },
                  {
                    label: "NavItem · with badge",
                    node: (
                      <div
                        style={{ width: "13rem", background: "rgba(234,234,235,0.6)", backdropFilter: "blur(60px)" }}
                        className="rounded-xl p-2 pr-3"
                      >
                        <SidebarNavItem icon={Radar} label="Monitoreo" href="#" badgeCount={3} />
                      </div>
                    ),
                  },
                ]}
              />

              <DSCode snippet={SIDEBAR_CODE} collapsedByDefault />
            </>
          }
        />
      </DSComponentSpec>
    </>
  );
}
