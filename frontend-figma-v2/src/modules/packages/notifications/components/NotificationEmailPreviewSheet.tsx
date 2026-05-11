import { FileText, Paperclip, Mail, Lock, Eye } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import isotipo from "@/assets/brand-isotipo.svg";
import { notificationsStrings } from "../strings";
import { NotificationStatusBadge } from "./NotificationStatusBadge";
import type { NotificationItem } from "../types";

interface NotificationEmailPreviewSheetProps {
  item: NotificationItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatDate(iso: string): string {
  if (!iso || iso === "—") return "—";
  try {
    return new Intl.DateTimeFormat("es-CO", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function NotificationEmailPreviewSheet({
  item,
  open,
  onOpenChange,
}: NotificationEmailPreviewSheetProps) {
  const t = notificationsStrings.emailPreview;
  const a = notificationsStrings.actions;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[860px] p-0 flex flex-col gap-0 bg-muted/40"
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border bg-card text-left">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <Eye size={12} aria-hidden="true" />
            {t.previewLabel}
          </div>
          <SheetTitle className="mt-1">{item?.title ?? "—"}</SheetTitle>
        </SheetHeader>

        {item && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 sm:gap-6">
              <EmailPreview item={item} />
              <NotificationSidePanel item={item} />
            </div>
          </div>
        )}

        <div className="border-t border-border bg-card p-4 flex justify-end">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            {a.close}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface EmailPreviewProps {
  item: NotificationItem;
}

function EmailPreview({ item }: EmailPreviewProps) {
  const t = notificationsStrings.emailPreview;

  return (
    <article
      aria-label={t.previewLabel}
      className="bg-card rounded-card border border-border shadow-sm overflow-hidden select-none"
    >
      {/* Email metadata strip (mail-client style) */}
      <div className="px-5 sm:px-6 py-4 border-b border-border bg-muted/30">
        <p className="text-base font-semibold text-foreground leading-snug">
          {item.email.subject}
        </p>
        <dl className="mt-3 grid grid-cols-[64px_1fr] gap-y-1 gap-x-3 text-xs">
          <dt className="text-muted-foreground">{t.fromLabel}</dt>
          <dd className="text-foreground truncate">{t.fromValue}</dd>
          <dt className="text-muted-foreground">{t.toLabel}</dt>
          <dd className="text-foreground truncate">{item.email.recipient}</dd>
          <dt className="text-muted-foreground">{t.dateLabel}</dt>
          <dd className="text-foreground">{formatDate(item.email.sentAt)}</dd>
        </dl>
      </div>

      {/* Branded header */}
      <header className="bg-primary px-5 sm:px-8 py-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10">
          <img src={isotipo} alt="" aria-hidden="true" className="h-5 w-5" />
        </div>
        <span className="text-base font-semibold text-primary-foreground">
          Licénciame
        </span>
      </header>

      {/* Body */}
      <div className="px-5 sm:px-8 py-7 flex flex-col gap-5 bg-card">
        <h2 className="text-lg font-semibold text-foreground leading-snug">
          {item.email.greeting}
        </h2>

        {item.email.bodyParagraphs.map((p, i) => (
          <p
            key={i}
            className="text-sm text-foreground/85 leading-relaxed"
          >
            {p}
          </p>
        ))}

        {item.email.details && item.email.details.length > 0 && (
          <div className="rounded-lg border border-border bg-muted/30 overflow-hidden">
            <p className="px-4 pt-3 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t.detailsLabel}
            </p>
            <dl className="divide-y divide-border">
              {item.email.details.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-3 px-4 py-2.5"
                >
                  <dt className="text-xs text-muted-foreground">{row.label}</dt>
                  <dd
                    className={
                      row.emphasis
                        ? "text-sm font-semibold text-foreground"
                        : "text-sm text-foreground"
                    }
                  >
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <div className="pt-1">
          <Button variant="default" size="default">
            {item.email.ctaLabel}
          </Button>
        </div>

        {item.email.attachment && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
              {t.attachmentLabel}
            </p>
            <div className="inline-flex items-center gap-3 border border-border rounded-lg px-3 py-2.5 bg-muted/40 max-w-full">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-error-subtle/40 shrink-0">
                <FileText size={16} className="text-foreground" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {item.email.attachment.label}
                </p>
                <p className="text-xs text-muted-foreground">PDF · adjunto simulado</p>
              </div>
              <Paperclip size={14} className="text-muted-foreground shrink-0" aria-hidden="true" />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="px-5 sm:px-8 py-4 border-t border-border bg-muted/30">
        <p className="text-xs text-muted-foreground leading-relaxed">
          {t.brandFooter}
        </p>
      </footer>
    </article>
  );
}

interface NotificationSidePanelProps {
  item: NotificationItem;
}

function NotificationSidePanel({ item }: NotificationSidePanelProps) {
  const s = notificationsStrings.emailPreview.sidePanel;

  return (
    <aside className="bg-card rounded-card border border-border shadow-sm p-5 flex flex-col gap-4 h-fit lg:sticky lg:top-4">
      <header className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15">
          <Mail size={14} className="text-foreground" aria-hidden="true" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">{s.title}</h3>
      </header>

      <Separator />

      <dl className="flex flex-col gap-3">
        <PanelRow label={s.statusLabel}>
          <NotificationStatusBadge status={item.status} />
        </PanelRow>
        <PanelRow label={s.channelLabel}>
          <Badge variant="info" className="gap-1">
            <Mail size={11} aria-hidden="true" />
            {s.channelValue}
          </Badge>
        </PanelRow>
        <PanelRow label={s.typeLabel}>
          <Badge variant="vigente">{s.typeValue}</Badge>
        </PanelRow>
        <PanelRow label={s.configurableLabel}>
          <Badge variant="consumida" className="gap-1">
            <Lock size={11} aria-hidden="true" />
            {s.configurableValue}
          </Badge>
        </PanelRow>
      </dl>

      {item.pendingNote && (
        <>
          <Separator />
          <p className="text-xs text-foreground/80 bg-warning-subtle/30 border border-warning-subtle/50 rounded-md px-2.5 py-2">
            {item.pendingNote}
          </p>
        </>
      )}
    </aside>
  );
}

function PanelRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm">{children}</dd>
    </div>
  );
}
