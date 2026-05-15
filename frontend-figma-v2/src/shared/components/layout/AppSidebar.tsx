import {
  LayoutDashboard,
  Music,
  FileText,
  List,
  CreditCard,
  Settings,
  BookOpen,
  Radar,
  Share2,
  BarChart3,
  Shuffle,
  Bell,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { SidebarShell } from "@/shared/components/sidebar/SidebarShell";
import { SidebarLogo } from "@/shared/components/sidebar/SidebarLogo";
import { SidebarNav, type SidebarNavEntry } from "@/shared/components/sidebar/SidebarNav";
import { SidebarUser } from "@/shared/components/sidebar/SidebarUser";
import { useCurrentUser } from "@/modules/packages/onboarding/hooks";
import { useMonitoringPendingCount } from "@/modules/monitoring/tracking/hooks";
import { roleLabel } from "@/shared/utils/labels";
import type { UserRole } from "@/api/types";

/** Items visible to every role by their `roles` allowlist. null = all roles. */
type NavItemDef = SidebarNavEntry & { roles: UserRole[] | null };

const ALL_ROLES: UserRole[] = ["company_admin", "manager", "creator", "auditor", "super_admin"];

/** Fixed frosted-glass sidebar (desktop only ≥768px) using Style Guide §14 primitives. */
export function AppSidebar() {
  const { pathname } = useLocation();
  const { data: user } = useCurrentUser();
  const pendingCount = useMonitoringPendingCount();

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
      // Monitoring: company_admin, manager, creator — not auditor (view-only role)
      roles: ["company_admin", "manager", "creator"],
    },
    // Métricas: company_admin, manager, auditor (auditor = read-only metrics access)
    { icon: BarChart3, label: "Métricas", href: "/metricas", active: pathname.startsWith("/metricas"), roles: ["company_admin", "manager", "auditor"] },
    // Créditos: company_admin and manager can purchase
    { icon: CreditCard, label: "Créditos", href: "/packages", active: pathname.startsWith("/packages"), tourTarget: "nav-packages", roles: ["company_admin", "manager"] },
    // Redes sociales: company_admin, manager, creator (connect accounts)
    { icon: Share2, label: "Redes sociales", href: "/social", active: pathname.startsWith("/social"), tourTarget: "nav-social", roles: ["company_admin", "manager", "creator"] },
    // Match de tracks: company_admin and manager
    { icon: Shuffle, label: "Match de tracks", href: "/match-tracks", active: pathname.startsWith("/match-tracks"), roles: ["company_admin", "manager"] },
    { icon: Bell, label: "Notificaciones", href: "/notifications", active: pathname.startsWith("/notifications"), roles: ALL_ROLES },
    { icon: Settings, label: "Configuración", href: "/settings", active: pathname.startsWith("/settings"), roles: ALL_ROLES },
    { icon: BookOpen, label: "Design System", href: "/design-system", active: pathname === "/design-system", roles: ["company_admin"] },
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
    <div className="hidden md:block">
      <SidebarShell variant="fixed">
        <SidebarLogo />
        <SidebarNav items={items} />
        <SidebarUser initials={initials} name={name} role={role} />
      </SidebarShell>
    </div>
  );
}
