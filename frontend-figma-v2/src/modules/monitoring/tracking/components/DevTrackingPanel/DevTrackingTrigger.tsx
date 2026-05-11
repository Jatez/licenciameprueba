import { FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTrackingStore } from "@/stores/trackingStore";
import { DevTrackingPanel } from "./DevTrackingPanel";
import { Suspense } from "react";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";

/**
 * Floating action button to open the dev tracking panel.
 * Only renders when `import.meta.env.DEV` is true (caller guard).
 */
export function DevTrackingTrigger() {
  const setDevPanelOpen = useTrackingStore((s) => s.setDevPanelOpen);

  return (
    <>
      <button
        type="button"
        onClick={() => setDevPanelOpen(true)}
        aria-label={trackingStrings.devPanel.triggerLabel}
        className="fixed bottom-4 right-4 z-[60] flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <FlaskConical className="h-5 w-5" aria-hidden="true" />
      </button>
      <Suspense fallback={null}>
        <DevTrackingPanel />
      </Suspense>
    </>
  );
}
