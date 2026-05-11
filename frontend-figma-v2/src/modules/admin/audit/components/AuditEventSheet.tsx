import { ShieldAlert, CheckCircle2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { AuditSeverityBadge } from "./AuditSeverityBadge";
import { AuditDiffViewer } from "./AuditDiffViewer";
import { auditStrings } from "../strings";
import type { AuditEvent } from "../types";

interface Props {
  event: AuditEvent | null;
  onOpenChange: (open: boolean) => void;
  onMarkReviewed: (id: string) => void;
}

function formatFullDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("es-CO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="text-sm text-foreground break-words">{value}</p>
    </div>
  );
}

export function AuditEventSheet({ event, onOpenChange, onMarkReviewed }: Props) {
  const t = auditStrings.detail;
  const open = Boolean(event);

  const handleMarkReviewed = () => {
    if (!event) return;
    onMarkReviewed(event.id);
    toast.success(t.actions.markedToast);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl overflow-y-auto"
        aria-describedby="audit-event-description"
      >
        {event && (
          <>
            <SheetHeader>
              <SheetTitle>{t.title}</SheetTitle>
              <SheetDescription id="audit-event-description">{t.description}</SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <AuditSeverityBadge severity={event.severity} />
                  <Badge variant="secondary">{auditStrings.module[event.module]}</Badge>
                  {event.reviewed && (
                    <Badge variant="vigente" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                      {t.actions.alreadyReviewed}
                    </Badge>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-foreground">{event.action}</h3>
              </div>

              {event.isCritical && (
                <div className="flex gap-3 rounded-lg border border-error/40 bg-error/10 p-3">
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-error" aria-hidden="true" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-error">
                      {auditStrings.criticalBanner.title}
                    </p>
                    <p className="text-xs text-foreground/80">
                      {auditStrings.criticalBanner.body}
                    </p>
                  </div>
                </div>
              )}

              <Separator />

              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">{t.sections.summary}</p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label={t.fields.eventId} value={<span className="font-tnum">{event.id}</span>} />
                  <Field label={t.fields.timestamp} value={formatFullDate(event.timestamp)} />
                  <Field label={t.fields.module} value={auditStrings.module[event.module]} />
                  <Field
                    label={t.fields.actor}
                    value={
                      <span>
                        {event.actorName}
                        <br />
                        <span className="text-xs text-muted-foreground">{event.actorEmail}</span>
                      </span>
                    }
                  />
                  <Field
                    label={t.fields.resource}
                    value={
                      <span>
                        {event.resourceLabel}
                        <br />
                        <span className="text-xs text-muted-foreground font-tnum">
                          {event.resourceId}
                        </span>
                      </span>
                    }
                  />
                  <Field label={t.fields.ip} value={<span className="font-tnum">{event.ip}</span>} />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">{t.sections.diff}</p>
                <AuditDiffViewer diff={event.diff} />
              </div>

              <Separator />

              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">{t.sections.session}</p>
                <div className="space-y-2 rounded-lg bg-muted/40 p-3">
                  <Field
                    label={t.fields.userAgent}
                    value={<span className="font-tnum text-xs">{event.userAgent}</span>}
                  />
                  <Field
                    label={t.fields.sessionId}
                    value={<span className="font-tnum text-xs">{event.sessionId}</span>}
                  />
                </div>
              </div>

              {event.notes && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">{t.sections.notes}</p>
                  <p className="text-sm text-muted-foreground">{event.notes}</p>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <Button
                  variant={event.reviewed ? "ghost" : "default"}
                  onClick={handleMarkReviewed}
                  disabled={event.reviewed}
                >
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  {event.reviewed ? t.actions.alreadyReviewed : t.actions.markReviewed}
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
