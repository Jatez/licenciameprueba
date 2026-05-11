import { CheckCircle2, Circle, Clock, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { License } from "@/api/types";
import { cn } from "@/lib/utils";
import { formatString, licensingStrings } from "@/modules/packages/licensing/strings";
import { formatLicenseDate } from "@/modules/packages/licensing/utils";

interface Props {
  license: License;
}

interface Step {
  icon: LucideIcon;
  iconClass: string;
  title: string;
  detail: string;
  active: boolean;
}

export function LicenseTimelineBlock({ license }: Props) {
  const t = licensingStrings.detail.timeline;

  const steps: Step[] = [];

  steps.push({
    icon: CheckCircle2,
    iconClass: "text-success",
    title: t.issued,
    detail: formatLicenseDate(license.issuedAt),
    active: true,
  });

  if (license.status === "consumed") {
    steps.push({
      icon: CheckCircle2,
      iconClass: "text-info",
      title: t.consumed,
      detail: formatLicenseDate(license.consumedAt ?? license.issuedAt),
      active: true,
    });
  } else if (license.status === "cancelled") {
    steps.push({
      icon: XCircle,
      iconClass: "text-destructive",
      title: t.cancelled,
      detail: formatLicenseDate(license.cancelledAt),
      active: true,
    });
  } else if (license.status === "expired") {
    steps.push({
      icon: Clock,
      iconClass: "text-muted-foreground",
      title: t.expired,
      detail: formatLicenseDate(license.expiresAt),
      active: true,
    });
  } else {
    steps.push({
      icon: Circle,
      iconClass: "text-muted-foreground",
      title: t.consumed,
      detail: t.consumedPending,
      active: false,
    });
  }

  if (license.cancellableUntil) {
    const isOpen =
      license.status === "active" &&
      new Date(license.cancellableUntil).getTime() > Date.now();
    steps.push({
      icon: isOpen ? Clock : Circle,
      iconClass: isOpen ? "text-warning" : "text-muted-foreground",
      title: t.cancellationWindow,
      detail: isOpen
        ? formatString(t.cancellationWindowUntil, {
            date: formatLicenseDate(license.cancellableUntil),
          })
        : t.cancellationWindowClosed,
      active: isOpen,
    });
  }

  return (
    <section
      aria-label={licensingStrings.detail.sections.timeline}
      className="rounded-xl border border-border bg-card p-5"
    >
      <h2 className="text-sm font-semibold text-foreground">
        {licensingStrings.detail.sections.timeline}
      </h2>

      <ol className="mt-4 space-y-4">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <li key={i} className="flex items-start gap-3">
              <Icon
                className={cn(
                  "mt-0.5 h-5 w-5 flex-shrink-0",
                  s.iconClass,
                  !s.active && "opacity-60",
                )}
                aria-hidden="true"
              />
              <div className="flex-1">
                <div
                  className={cn(
                    "text-sm font-medium",
                    s.active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {s.title}
                </div>
                <div className="text-xs text-muted-foreground">{s.detail}</div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
