import {
  LayoutDashboard,
  Music,
  FolderKanban,
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

/** Fixed frosted-glass sidebar (desktop only ≥768px) using Style Guide §14 primitives. */
export function AppSidebar() {
  const { pathname } = useLocation();
  const { data: user } = useCurrentUser();
  const pendingCount = useMonitoringPendingCount();

  const items: SidebarNavEntry[] = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard03", active: pathname === "/dashboard03" },
    { icon: Music, label: "Explorar música", href: "/catalog", active: pathname.startsWith("/catalog"), tourTarget: "nav-catalog" },
    { icon: FileText, label: "Licencias", href: "/licenses", active: pathname.startsWith("/licenses") },
    {
      icon: Radar,
      label: "Monitoreo",
      href: "/monitoring",
      active: pathname.startsWith("/monitoring"),
      badgeCount: pendingCount,
    },
    { icon: BarChart3, label: "Métricas", href: "/metricas", active: pathname.startsWith("/metricas") },
    { icon: CreditCard, label: "Créditos", href: "/packages", active: pathname.startsWith("/packages"), tourTarget: "nav-packages" },
    { icon: Share2, label: "Redes sociales", href: "/social", active: pathname.startsWith("/social"), tourTarget: "nav-social" },
    { icon: Shuffle, label: "Match de tracks", href: "/match-tracks", active: pathname.startsWith("/match-tracks") },
    { icon: Bell, label: "Notificaciones", href: "/notifications", active: pathname.startsWith("/notifications") },
    { icon: Settings, label: "Configuración", href: "/settings", active: pathname.startsWith("/settings") },
    { icon: BookOpen, label: "Design System", href: "/design-system", active: pathname === "/design-system" },
  ];

  const initials = user?.fullName
    ? user.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
    : "MG";
  const name = user?.fullName ?? "María Gómez";
  const role = user?.role === "company_admin" ? "Brand Manager" : (user?.role ?? "Brand Manager");

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
