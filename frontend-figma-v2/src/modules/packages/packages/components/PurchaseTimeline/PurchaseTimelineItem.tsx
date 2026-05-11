import {
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  Mail,
  ReceiptText,
  Shield,
  Sparkles,
  Wallet,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { PurchaseEvent, PurchaseEventType } from "@/api/types";
import { packagesStrings } from "@/modules/packages/packages/strings";
import { formatDateTime } from "@/modules/packages/packages/utils/formatDate";

const ICONS: Record<PurchaseEventType, LucideIcon> = {
  order_created: Sparkles,
  quote_generated: FileText,
  payment_initiated: CreditCard,
  payment_pending: Clock,
  payment_received: Wallet,
  payment_rejected: XCircle,
  manual_review_flagged: Shield,
  credits_credited: CheckCircle2,
  receipt_emitted: ReceiptText,
  confirmation_email_sent: Mail,
};

const TONE: Record<
  PurchaseEventType,
  { ring: string; icon: string; bg: string }
> = {
  order_created: { ring: "ring-border", icon: "text-foreground", bg: "bg-muted" },
  quote_generated: { ring: "ring-border", icon: "text-foreground", bg: "bg-muted" },
  payment_initiated: { ring: "ring-border", icon: "text-foreground", bg: "bg-muted" },
  payment_pending: { ring: "ring-warning/40", icon: "text-[#92400E]", bg: "bg-warning-subtle" },
  payment_received: { ring: "ring-info/40", icon: "text-[#1E40AF]", bg: "bg-info-subtle" },
  payment_rejected: { ring: "ring-destructive/40", icon: "text-destructive", bg: "bg-error-subtle" },
  manual_review_flagged: { ring: "ring-info/40", icon: "text-[#1E40AF]", bg: "bg-info-subtle" },
  credits_credited: { ring: "ring-success/40", icon: "text-[#166534]", bg: "bg-success-subtle" },
  receipt_emitted: { ring: "ring-border", icon: "text-foreground", bg: "bg-muted" },
  confirmation_email_sent: { ring: "ring-border", icon: "text-foreground", bg: "bg-muted" },
};

interface Props {
  event: PurchaseEvent;
  isLast: boolean;
  isActive: boolean;
}

export function PurchaseTimelineItem({ event, isLast, isActive }: Props) {
  const s = packagesStrings.timeline;
  const Icon = ICONS[event.type] ?? Sparkles;
  const tone = TONE[event.type] ?? TONE.order_created;
  return (
    <li
      aria-current={isActive ? "step" : undefined}
      className="relative grid grid-cols-[28px_1fr] gap-3 pb-5 last:pb-0"
    >
      {!isLast ? (
        <span
          aria-hidden="true"
          className="absolute left-3.5 top-7 h-[calc(100%-1rem)] w-px bg-border"
        />
      ) : null}
      <span
        aria-hidden="true"
        className={`relative z-[1] flex h-7 w-7 items-center justify-center rounded-full ring-2 ${tone.ring} ${tone.bg} ${
          isActive ? "ring-primary" : ""
        }`}
      >
        <Icon className={`h-3.5 w-3.5 ${tone.icon}`} />
      </span>
      <div className="space-y-0.5">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <p className="text-sm font-medium text-foreground">
            {s.events[event.type]}
          </p>
          <span className="text-xs text-muted-foreground">
            · {s.actor[event.actor]}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {formatDateTime(event.occurredAt)}
        </p>
        {event.note ? (
          <p className="text-xs text-muted-foreground">{event.note}</p>
        ) : null}
      </div>
    </li>
  );
}
