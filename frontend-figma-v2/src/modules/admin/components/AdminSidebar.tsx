import {
  LayoutDashboard,
  Music,
  Building2,
  PackageOpen,
  FileText,
  Wallet,
  ShieldCheck,
  Users,
  ArrowLeftCircle,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { SidebarShell } from "@/shared/components/sidebar/SidebarShell";
import { SidebarLogo } from "@/shared/components/sidebar/SidebarLogo";
import { SidebarNav, type SidebarNavEntry } from "@/shared/components/sidebar/SidebarNav";
import { SidebarUser } from "@/shared/components/sidebar/SidebarUser";
import { SidebarNavItem } from "@/shared/components/sidebar/SidebarNavItem";
import { useMockSession } from "@/modules/auth/hooks/useMockSession";
import { adminStrings } from "../strings";

/**
 * Admin sidebar — same primitives as AppSidebar to keep visual consistency.
 * Pinned to /admin/* routes via AdminLayout.
 */
export function AdminSidebar() {
  const { pathname } = useLocation();
  const { session } = useMockSession();
  const t = adminStrings.nav;

  const items: SidebarNavEntry[] = [
    { icon: LayoutDashboard, label: t.overview, href: "/admin", active: pathname === "/admin" },
    { icon: Music, label: t.catalog, href: "/admin/catalog", active: pathname.startsWith("/admin/catalog") },
    { icon: Building2, label: t.companies, href: "/admin/companies", active: pathname.startsWith("/admin/companies") },
    { icon: PackageOpen, label: t.pricing, href: "/admin/pricing", active: pathname.startsWith("/admin/pricing") },
    { icon: FileText, label: t.licenses, href: "/admin/licenses", active: pathname.startsWith("/admin/licenses") },
    { icon: Wallet, label: t.billing, href: "/admin/billing", active: pathname.startsWith("/admin/billing") },
    { icon: ShieldCheck, label: t.audit, href: "/admin/audit", active: pathname.startsWith("/admin/audit") },
    { icon: Users, label: t.access, href: "/admin/access", active: pathname.startsWith("/admin/access") },
  ];

  const fullName = session?.fullName ?? "Camila Soto";
  const initials = fullName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="hidden md:block">
      <SidebarShell variant="fixed">
        <SidebarLogo />
        <SidebarNav items={items} />
        <div className="px-2 pb-2">
          <SidebarNavItem
            icon={ArrowLeftCircle}
            label={t.backToApp}
            href="/dashboard03"
          />
        </div>
        <SidebarUser initials={initials} name={fullName} role={adminStrings.user.roleLabel} />
      </SidebarShell>
    </div>
  );
}
