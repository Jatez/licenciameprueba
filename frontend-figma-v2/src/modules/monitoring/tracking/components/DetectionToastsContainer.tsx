/**
 * Bridges `trackingStore.recentDetectionToastQueue` → sonner.
 * Mounted once in the AppLayout.
 */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTrackingStore } from "@/stores/trackingStore";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";

export function DetectionToastsContainer() {
  const queue = useTrackingStore((s) => s.recentDetectionToastQueue);
  const dismiss = useTrackingStore((s) => s.dismissDetectionToast);
  const navigate = useNavigate();

  useEffect(() => {
    if (!queue.length) return;
    const post = queue[0];
    const t = trackingStrings.detectionToast;
    const message = t.matchedMessage
      .replace("{trackTitle}", post.snapshot?.detectedTrackTitle ?? "")
      .replace("{artist}", post.snapshot?.detectedArtist ?? "")
      .replace("{licenseId}", post.licenseId ?? "—");

    toast(t.title, {
      description: message,
      duration: 5000,
      action: {
        label: t.viewAction,
        onClick: () => navigate(`/monitoring?post=${post.id}`),
      },
    });
    dismiss(post.id);
  }, [queue, dismiss, navigate]);

  return null;
}
