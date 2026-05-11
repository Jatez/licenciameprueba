import type { PurchaseEvent } from "@/api/types";
import { packagesStrings } from "@/modules/packages/packages/strings";
import { PurchaseTimelineItem } from "./PurchaseTimelineItem";

interface Props {
  events: PurchaseEvent[];
  ariaLabel?: string;
}

/** Vertical audit-log timeline for a purchase. */
export function PurchaseTimeline({ events, ariaLabel }: Props) {
  const s = packagesStrings.timeline;
  if (!events.length) {
    return (
      <p className="text-sm text-muted-foreground">{s.empty}</p>
    );
  }
  const ordered = [...events].sort((a, b) =>
    a.occurredAt.localeCompare(b.occurredAt),
  );
  const lastIndex = ordered.length - 1;
  return (
    <ol aria-label={ariaLabel ?? s.title} className="relative">
      {ordered.map((event, idx) => (
        <PurchaseTimelineItem
          key={event.id}
          event={event}
          isLast={idx === lastIndex}
          isActive={idx === lastIndex}
        />
      ))}
    </ol>
  );
}
