import {
  FileText,
  Loader2,
  CheckCircle2,
  XCircle,
  Receipt,
  RotateCcw,
  CreditCard,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { billingStrings } from "../strings";
import type { PaymentTimelineEvent, PaymentTimelineEventType } from "../types";

const ICON: Record<PaymentTimelineEventType, LucideIcon> = {
  created: FileText,
  processing: Loader2,
  paid: CheckCircle2,
  failed: XCircle,
  refunded: RotateCcw,
  reconciled: Receipt,
  credit_note_issued: CreditCard,
};

const COLOR: Record<PaymentTimelineEventType, string> = {
  created: "bg-info/15 text-info",
  processing: "bg-warning/15 text-warning",
  paid: "bg-success/15 text-success",
  failed: "bg-error/15 text-error",
  refunded: "bg-muted text-muted-foreground",
  reconciled: "bg-primary/20 text-foreground",
  credit_note_issued: "bg-primary/20 text-foreground",
};

function formatDateTime(iso: string) {
  try {
    return new Intl.DateTimeFormat("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function PaymentTimeline({ events }: { events: PaymentTimelineEvent[] }) {
  return (
    <ol className="relative space-y-5 border-l border-border pl-5">
      {events.map((ev) => {
        const Icon = ICON[ev.type];
        return (
          <li key={ev.id} className="relative">
            <span
              className={`absolute -left-[34px] flex h-6 w-6 items-center justify-center rounded-full ${COLOR[ev.type]}`}
            >
              <Icon className="h-3 w-3" aria-hidden="true" />
            </span>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-foreground">{ev.title}</p>
                <span className="text-xs text-muted-foreground font-tnum">
                  {formatDateTime(ev.timestamp)}
                </span>
              </div>
              {ev.description && <p className="text-sm text-muted-foreground">{ev.description}</p>}
              {ev.actor && (
                <p className="text-xs text-muted-foreground">
                  Actor: <span className="text-foreground">{ev.actor}</span>
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

// Avoid unused import warning when timeline labels are needed elsewhere
export const __timelineLabels = billingStrings.timelineLabels;
