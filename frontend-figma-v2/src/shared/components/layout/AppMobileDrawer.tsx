import { useEffect } from "react";
import {
  LayoutDashboard,
  Music,
  FileText,
  CreditCard,
  BookOpen,
  BarChart3,
  Bell,
  Radar,
  Share2,
  Shuffle,
  Settings,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { SidebarLogo } from "@/shared/components/sidebar/SidebarLogo";
import { SidebarNav, type SidebarNavEntry } from "@/shared/components/sidebar/SidebarNav";
import { SidebarUser } from "@/shared/components/sidebar/SidebarUser";
import { useCurrentUser } from "@/modules/packages/onboarding/hooks";
import { useMonitoringPendingCount } from "@/modules/monitoring/tracking/hooks";
import { roleLabel } from "@/shared/utils/labels";
import type { UserRole } from "@/api/types";

interface AppMobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Slide-in drawer for <768px built on top of shadcn Sheet:
 * focus trap, Escape, overlay click, body scroll-lock and a11y are handled
 * natively. Auto-closes when the route changes.
 */
export function AppMobileDrawer({ open, onClose }: AppMobileDrawerProps) {
  const { pathname } = useLocation();
  const { data: user } = useCurrentUser();
  const pendingCount = useMonitoringPendingCount();

  // Close drawer automatically on navigation (clicking a nav item).
  useEffect(() => {
    if (open) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  type NavItemDef = SidebarNavEntry & { roles: UserRole[] | null };
  const ALL_ROLES: UserRole[] = ["company_admin", "manager", "creator", "auditor", "super_admin"];

  const allItems: NavItemDef[] = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard03", active: pathname === "/dashboard03", roles: ALL_ROLES },
    { icon: Music, label: "Explorar música", href: "/catalog", active: pathname.startsWith("/catalog"), tourTarget: "nav-catalog", roles: ALL_ROLES },
    { icon: FileText, label: "Licencias", href: "/licenses", active: pathname.startsWith("/licenses"), roles: ALL_ROLES },
    {
      icon: Radar,
      label: "Monitoreo",
      href: "/monitoring",
      active: pathname.startsWith("/monitoring"),
      badgeCount: pendingCount,
      roles: ["company_admin", "manager", "creator"] as UserRole[],
    },
    { icon: BarChart3, label: "Métricas", href: "/metricas", active: pathname.startsWith("/metricas"), roles: ["company_admin", "manager", "auditor"] as UserRole[] },
    { icon: CreditCard, label: "Créditos", href: "/packages", active: pathname.startsWith("/packages"), tourTarget: "nav-packages", roles: ["company_admin", "manager"] as UserRole[] },
    { icon: Share2, label: "Redes sociales", href: "/social", active: pathname.startsWith("/social"), tourTarget: "nav-social", roles: ["company_admin", "manager", "creator"] as UserRole[] },
    { icon: Shuffle, label: "Match de tracks", href: "/match-tracks", active: pathname.startsWith("/match-tracks"), roles: ["company_admin", "manager"] as UserRole[] },
    { icon: Bell, label: "Notificaciones", href: "/notifications", active: pathname.startsWith("/notifications"), roles: ALL_ROLES },
    { icon: Settings, label: "Configuración", href: "/settings", active: pathname.startsWith("/settings"), roles: ALL_ROLES },
    { icon: BookOpen, label: "Design System", href: "/design-system", active: pathname === "/design-system", roles: ["company_admin"] as UserRole[] },
  ];

  const userRole = user?.role as UserRole | undefined;
  const items: SidebarNavEntry[] = allItems
    .filter(({ roles }) => !userRole || roles === null || roles.includes(userRole))
    .map(({ roles: _roles, ...entry }) => entry);

  const initials = user?.fullName
    ? user.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
    : "MG";
  const name = user?.fullName ?? "María Gómez";
  const role = user?.role ? roleLabel(user.role as UserRole) : "Brand Manager";

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <SheetContent
        side="left"
        className="md:hidden p-0 w-[17rem] sm:w-[17rem] sm:max-w-[17rem] bg-sidebar-bg border-r-0 flex flex-col overflow-y-auto scrollbar-minimal"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Menú principal</SheetTitle>
          <SheetDescription>Navegación de la aplicación</SheetDescription>
        </SheetHeader>
        <SidebarLogo />
        <SidebarNav items={items} />
        <SidebarUser initials={initials} name={name} role={role} />
      </SheetContent>
    </Sheet>
  );
}
