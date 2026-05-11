/**
 * Bridge between the simulator singleton and React Query / UI store.
 * MUST be mounted exactly once (in the AppLayout).
 */
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { trackingSimulator } from "@/shared/tracking-simulator";
import { useTrackingStore } from "@/stores/trackingStore";

export function useTrackingEvents(): void {
  const queryClient = useQueryClient();
  const pushDetectionToast = useTrackingStore((s) => s.pushDetectionToast);

  useEffect(() => {
    const unsubscribe = trackingSimulator.subscribe((event) => {
      switch (event.type) {
        case "post-detected":
        case "post-matched":
        case "post-no-match":
        case "post-linked-manually":
        case "post-unlinked":
          queryClient.invalidateQueries({ queryKey: ["detected-posts"] });
          queryClient.invalidateQueries({ queryKey: ["license-content"] });
          queryClient.invalidateQueries({ queryKey: ["dashboard"] });
          queryClient.invalidateQueries({ queryKey: ["licenses"] });
          if (event.type === "post-matched") {
            pushDetectionToast(event.post);
          }
          break;
        case "evidence-expired":
          queryClient.invalidateQueries({ queryKey: ["detected-posts"] });
          queryClient.invalidateQueries({ queryKey: ["license-content"] });
          break;
        case "sync-error":
          queryClient.invalidateQueries({ queryKey: ["sync-status"] });
          break;
      }
    });
    return unsubscribe;
  }, [queryClient, pushDetectionToast]);
}
