import { CheckCircle2, Info, AlertTriangle, AlertCircle, type LucideIcon } from "lucide-react";

export type NotifTone = "success" | "error" | "info" | "warning";
export type NotifVariant = "filled" | "outlined";

export const toneIcon: Record<NotifTone, LucideIcon> = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
};

export const toneIconColor: Record<NotifTone, string> = {
  success: "text-success",
  info: "text-info",
  warning: "text-warning",
  error: "text-error",
};

const filledClass: Record<NotifTone, string> = {
  success: "bg-success-subtle/40 text-foreground",
  info: "bg-info-subtle/40 text-foreground",
  warning: "bg-warning-subtle/40 text-foreground",
  error: "bg-error-subtle/40 text-foreground",
};

const outlinedClass: Record<NotifTone, string> = {
  success: "bg-surface text-foreground border border-success-subtle",
  info: "bg-surface text-foreground border border-info-subtle",
  warning: "bg-surface text-foreground border border-warning-subtle",
  error: "bg-surface text-foreground border border-error-subtle",
};

export function toneSurface(tone: NotifTone, variant: NotifVariant): string {
  return variant === "filled" ? filledClass[tone] : outlinedClass[tone];
}
