import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { PageShell } from "@/shared/components/layout/PageShell";
import { BodyCard } from "@/shared/components/layout/BodyCard";
import { AdminSidebar } from "./AdminSidebar";
import { MockAccessGuard } from "./MockAccessGuard";

/**
 * Admin shell — reuses PageShell + BodyCard from the company app to keep
 * spacing/scroll consistent. Mounted on /admin/*.
 */
export function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // NOTE: mobile drawer for admin is intentionally minimal in this prompt.
  // It can be wired later when admin sub-modules require deep mobile nav.
  void drawerOpen;

  return (
    <MockAccessGuard>
      <PageShell>
        <AdminSidebar />
        <BodyCard
          mobileMenuButton={
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center justify-center bg-sidebar-bg text-ink-900 rounded-lg"
              style={{ width: 40, height: 40 }}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          }
        >
          <Outlet />
        </BodyCard>
      </PageShell>
    </MockAccessGuard>
  );
}
