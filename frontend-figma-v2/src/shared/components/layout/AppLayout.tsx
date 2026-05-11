import { Suspense, lazy } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { PageShell } from "./PageShell";
import { BodyCard } from "./BodyCard";
import { AppSidebar } from "./AppSidebar";
import { AppMobileDrawer } from "./AppMobileDrawer";
import { useSidebarStore } from "@/stores/sidebarStore";
import {
  PersistentPlayer,
  usePlayerKeyboardShortcuts,
  usePlayerVisibleHeight,
  useSyncPlayerWithEngine,
} from "@/modules/packages/player";
import { useTrackingEvents } from "@/modules/monitoring/tracking/hooks";
import { DetectionToastsContainer } from "@/modules/monitoring/tracking/components/DetectionToastsContainer";
import { ExportNotificationCenter } from "@/modules/monitoring/metrics/components/export/ExportNotificationCenter";
import { OnboardingProvider } from "@/modules/packages/onboarding/tour";

const DevTrackingTrigger = lazy(() =>
  import("@/modules/monitoring/tracking/components/DevTrackingPanel/DevTrackingTrigger").then((m) => ({
    default: m.DevTrackingTrigger,
  })),
);

/** Composes the entire app shell for /dashboard03 and child routes. */
export function AppLayout() {
  const isOpen = useSidebarStore((s) => s.isOpen);
  const openSidebar = useSidebarStore((s) => s.open);
  const closeSidebar = useSidebarStore((s) => s.close);
  const headerMountCount = useSidebarStore((s) => s.headerMountCount);

  // Mounted ONCE: engine ↔ store sync, global keyboard shortcuts, tracking events.
  useSyncPlayerWithEngine();
  usePlayerKeyboardShortcuts();
  useTrackingEvents();
  const playerHeight = usePlayerVisibleHeight();

  return (
    <PageShell>
      <AppSidebar />
      <AppMobileDrawer open={isOpen} onClose={closeSidebar} />
      <BodyCard
        bottomInset={playerHeight}
        mobileMenuButton={headerMountCount === 0 ? (
          <button
            onClick={openSidebar}
            className="flex items-center justify-center bg-sidebar-bg text-ink-900 rounded-lg"
            style={{ width: 40, height: 40 }}
            aria-label="Abrir menú"
          >
            <Menu size={20} />
          </button>
        ) : undefined}
      >
        <Outlet />
      </BodyCard>
      <PersistentPlayer />
      <DetectionToastsContainer />
      <ExportNotificationCenter />
      <OnboardingProvider />
      {DevTrackingTrigger && (
        <Suspense fallback={null}>
          <DevTrackingTrigger />
        </Suspense>
      )}
    </PageShell>
  );
}
