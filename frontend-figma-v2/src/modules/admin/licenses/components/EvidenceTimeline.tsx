import {
  FileText,
  PlayCircle,
  Scale,
  RefreshCw,
  XCircle,
  AlertOctagon,
  EyeOff,
  ExternalLink,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { licensesStrings } from "../strings";
import type { EvidenceEventType, LicenseEvidenceEvent } from "../types";

const ICON: Record<EvidenceEventType, LucideIcon> = {
  issued: FileText,
  first_use_detected: PlayCircle,
  publication: PlayCircle,
  legal_review: Scale,
  renewed: RefreshCw,
  cancelled: XCircle,
  disputed: AlertOctagon,
  track_hidden: EyeOff,
};

const COLOR: Record<EvidenceEventType, string> = {
  issued: "bg-info/15 text-info",
  first_use_detected: "bg-primary/20 text-foreground",
  publication: "bg-primary/20 text-foreground",
  legal_review: "bg-warning/15 text-warning",
  renewed: "bg-info/15 text-info",
  cancelled: "bg-muted text-muted-foreground",
  disputed: "bg-error/15 text-error",
  track_hidden: "bg-warning/15 text-warning",
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

export function EvidenceTimeline({ events }: { events: LicenseEvidenceEvent[] }) {
  const t = licensesStrings.detail.evidence;
  if (!events || events.length === 0) {
    return <p className="text-sm text-muted-foreground">{t.empty}</p>;
  }
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
              <p className="text-sm text-muted-foreground">{ev.description}</p>
              {ev.actor && (
                <p className="text-xs text-muted-foreground">
                  Actor: <span className="text-foreground">{ev.actor}</span>
                </p>
              )}
              {ev.url && (
                <a
                  href={ev.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-foreground underline-offset-2 hover:underline"
                >
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  {t.openLink}
                </a>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
