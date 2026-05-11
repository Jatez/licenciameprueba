import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { trackingSimulator } from "@/shared/tracking-simulator";
import type { TrackingEvent } from "@/shared/tracking-simulator";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";
import { toast } from "sonner";

export function DevEventLog() {
  const [events, setEvents] = useState<TrackingEvent[]>(() =>
    trackingSimulator.getRecentEvents(),
  );
  const t = trackingStrings.devPanel.eventLog;

  useEffect(() => {
    const unsubscribe = trackingSimulator.subscribe(() => {
      setEvents(trackingSimulator.getRecentEvents());
    });
    return unsubscribe;
  }, []);

  const handleClear = () => {
    trackingSimulator.clearRecentEvents();
    setEvents([]);
  };

  const handleCopy = async () => {
    const payload = JSON.stringify(events, null, 2);
    try {
      await navigator.clipboard.writeText(payload);
      toast.success(t.copied);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={handleClear}>
          {t.clear}
        </Button>
        <Button variant="ghost" size="sm" onClick={handleCopy}>
          {t.copy}
        </Button>
      </div>

      {events.length === 0 ? (
        <p className="text-xs text-muted-foreground">{t.empty}</p>
      ) : (
        <ul className="space-y-1.5 max-h-72 overflow-auto">
          {events.map((event, idx) => (
            <li
              key={`${event.at}-${idx}`}
              className="rounded-md border border-border bg-muted/30 px-2.5 py-1.5 text-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono font-medium text-foreground">{event.type}</span>
                <span className="text-muted-foreground tabular-nums">
                  {new Date(event.at).toLocaleTimeString()}
                </span>
              </div>
              <p className="mt-0.5 text-muted-foreground line-clamp-1">{describeEvent(event)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function describeEvent(event: TrackingEvent): string {
  switch (event.type) {
    case "post-detected":
    case "post-no-match":
    case "evidence-expired":
    case "post-unlinked":
      return `${event.post.platform} · ${event.post.snapshot.detectedTrackTitle}`;
    case "post-matched":
    case "post-linked-manually":
      return `${event.post.platform} · ${event.license.licenseTokenId}`;
    case "sync-error":
      return `${event.platform} · ${event.error}`;
  }
}
