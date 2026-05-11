import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  CreditCard,
  FileCheck,
  Link2,
  Radar,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  Unlink,
  WifiOff,
  XCircle,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { ActivityItem as ActivityItemType, ActivityType } from "@/api/types.dashboard";
import { useFormatDate } from "../../hooks";
import { dashboardV2Strings } from "../../strings";

const iconByType: Record<ActivityType, typeof FileCheck> = {
  "license-issued": FileCheck,
  "license-cancelled": XCircle,
  "credits-purchased": CreditCard,
  "post-detected": Sparkles,
  "post-matched-auto": Zap,
  "post-matched-manual": Link2,
  "post-unlinked": Unlink,
  "evidence-expired": ShieldCheck,
  "license-consumed-by-post": FileCheck,
  "social-account-connected": Link2,
  "low-balance-alert": TrendingDown,
  "bag-expiring-alert": AlertTriangle,
  "license-needs-review": ShieldAlert,
  "sync-error": WifiOff,
  "no-match-found": Radar,
};

const colorByType: Record<ActivityType, string> = {
  "license-issued": "text-foreground bg-success-subtle",
  "license-cancelled": "text-foreground bg-error-subtle",
  "credits-purchased": "text-foreground bg-info-subtle",
  "post-detected": "text-metric bg-metric-subtle/[0.63]",
  "post-matched-auto": "text-foreground bg-success-subtle",
  "post-matched-manual": "text-foreground bg-info-subtle",
  "post-unlinked": "text-foreground bg-error-subtle",
  "evidence-expired": "text-foreground bg-warning-subtle",
  "license-consumed-by-post": "text-foreground bg-info-subtle",
  "social-account-connected": "text-foreground bg-info-subtle",
  "low-balance-alert": "text-foreground bg-error-subtle",
  "bag-expiring-alert": "text-foreground bg-warning-subtle",
  "license-needs-review": "text-foreground bg-warning-subtle",
  "sync-error": "text-foreground bg-error-subtle",
  "no-match-found": "text-foreground bg-warning-subtle",
};

const defaultActionByType: Partial<Record<ActivityType, string>> = {
  "license-needs-review": dashboardV2Strings.recentActivity.actions.review,
  "bag-expiring-alert": dashboardV2Strings.recentActivity.actions.buy,
  "low-balance-alert": dashboardV2Strings.recentActivity.actions.buy,
};

interface ActivityItemProps {
  item: ActivityItemType;
  hideTimestamp?: boolean;
  hideCta?: boolean;
}

export function ActivityItem({ item, hideTimestamp = false, hideCta = false }: ActivityItemProps) {
  const navigate = useNavigate();
  const { relative } = useFormatDate();
  const Icon = iconByType[item.type];
  const t = dashboardV2Strings.recentActivity;
  const ctaLabel = item.actionLabel ?? defaultActionByType[item.type] ?? t.actions.view;
  const showAside = !hideTimestamp || (!hideCta && item.actionRoute);

  const statusVariant: Record<NonNullable<ActivityItemType["status"]>, "vigente" | "pendiente" | "expirada" | "info"> = {
    success: "vigente",
    warning: "pendiente",
    error: "expirada",
    info: "info",
  };

  return (
    <li className="flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/60">
      <span
        className={cn(
          "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
          colorByType[item.type],
        )}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{item.title}</span>
          {item.status && (
            <Badge variant={statusVariant[item.status]} className="px-1.5 py-0 text-[10px]">
              {item.status}
            </Badge>
          )}
        </div>
        <span className="line-clamp-2 text-xs text-muted-foreground">{item.description}</span>
      </div>
      {showAside && (
        <div className="flex shrink-0 flex-col items-end gap-0.5">
          {!hideTimestamp && (
            <time dateTime={item.timestamp} className="text-[11px] text-muted-foreground font-tnum">
              {relative(item.timestamp)}
            </time>
          )}
          {!hideCta && item.actionRoute && (
            <button
              type="button"
              onClick={() => navigate(item.actionRoute!)}
              className="text-xs font-medium text-foreground hover:underline"
            >
              {ctaLabel} →
            </button>
          )}
        </div>
      )}
    </li>
  );
}
