import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Info, X, ShieldAlert, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { DashboardAlert, AlertSeverity } from "@/api/types.dashboard";
import { dashboardV2Strings } from "../../strings";

interface AlertBannerProps {
  alert: DashboardAlert;
  onDismiss?: (id: string) => void;
}

const severityToIcon: Record<AlertSeverity, typeof Info> = {
  critical: ShieldAlert,
  warning: AlertTriangle,
  info: Info,
};

const EXIT_MS = 250;

export function AlertBanner({ alert, onDismiss }: AlertBannerProps) {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
  const Icon = severityToIcon[alert.severity];
  const role = alert.severity === "critical" ? "alert" : undefined;

  const handleDismiss = () => {
    if (isExiting) return;
    setIsExiting(true);
    window.setTimeout(() => onDismiss?.(alert.id), EXIT_MS);
  };

  return (
    <div
      role={role}
      className={cn(
        "flex items-center gap-3 rounded-xl bg-primary px-4 py-2.5 text-foreground",
        "motion-safe:animate-fade-in",
        "transition-all duration-200 ease-out motion-reduce:transition-none motion-reduce:transform-none",
        isExiting && "opacity-0 -translate-y-2 scale-[0.98]",
      )}
    >
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-foreground"
        aria-hidden="true"
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <p className="text-sm font-semibold text-foreground">{alert.title}</p>
        <p className="text-sm text-foreground/70 truncate">{alert.message}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {alert.ctaLabel && alert.ctaRoute && (
          <Button
            size="sm"
            className="bg-foreground text-background hover:bg-foreground/90 h-8 px-3 text-xs"
            onClick={() => navigate(alert.ctaRoute!)}
          >
            {alert.ctaLabel}
            <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        )}
        {alert.dismissible && onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            aria-label={dashboardV2Strings.alerts.dismiss}
            onClick={handleDismiss}
            className="h-9 w-9 p-1.5 text-foreground/70 hover:bg-foreground/10 hover:text-foreground"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  );
}
