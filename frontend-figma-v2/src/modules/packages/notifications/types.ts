import type { LucideIcon } from "lucide-react";

export type NotificationStatus = "sent" | "pending_rule" | "needs_definition";

export type NotificationKind =
  | "registration"
  | "credit_purchase"
  | "license_issued"
  | "low_balance"
  | "package_expiring";

export interface NotificationAttachment {
  label: string;
  type: "invoice_pdf" | "certificate_pdf";
}

export interface EmailDetailRow {
  label: string;
  value: string;
  emphasis?: boolean;
}

export interface NotificationEmailPreview {
  subject: string;
  recipient: string;
  sentAt: string; // ISO o "—"
  greeting: string;
  bodyParagraphs: string[];
  /** Bloque estructurado opcional con detalles tipo "resumen de compra". */
  details?: EmailDetailRow[];
  ctaLabel: string;
  attachment?: NotificationAttachment;
}

export interface NotificationPrimaryAction {
  label: string;
  /** Ruta interna a navegar (ej. "/packages"). */
  to: string;
}

export interface NotificationItem {
  id: string;
  kind: NotificationKind;
  icon: LucideIcon;
  title: string;
  event: string;
  description: string;
  contentSummary: string;
  status: NotificationStatus;
  pendingNote?: string;
  email: NotificationEmailPreview;
  /** CTA contextual opcional para acción derivada (ej. comprar créditos). */
  primaryAction?: NotificationPrimaryAction;
}

export interface NotificationChannelState {
  recipientEmail: string;
  emailVerified: boolean;
  channelLabel: string;
  disclaimer: string;
}

export interface NotificationPendingRule {
  id: string;
  title: string;
  description: string;
}
