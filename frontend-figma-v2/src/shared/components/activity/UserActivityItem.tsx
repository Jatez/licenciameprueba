import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/shared/components/ds/Avatar";
import type { UserActivity } from "@/api/types.dashboard";
import { USER_ACTIVITY_TYPES, renderActivityDescription } from "@/shared/constants/activityTypes";
import { relativeDate, longDateWithTime } from "@/shared/format";

export interface UserActivityItemProps {
  item: UserActivity;
  /** Show the actor avatar/name beside the timestamp (default false in dashboard, true in /activity). */
  showActor?: boolean;
  /** Render an inline expandable detail panel with the full payload. */
  expandable?: boolean;
  /** Override default behaviour (navigate to detail_url). */
  onActivate?: (item: UserActivity) => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * Single activity row driven by USER_ACTIVITY_TYPES. Used by both the
 * Dashboard "Actividad reciente" widget and the /activity full timeline.
 */
export function UserActivityItem({
  item,
  showActor = false,
  expandable = false,
  onActivate,
}: UserActivityItemProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const cfg = USER_ACTIVITY_TYPES[item.type];
  const Icon = cfg.icon;
  const description = renderActivityDescription(item.type, item.payload);
  const hasDetail = Boolean(item.detail_url);
  const interactive = expandable || hasDetail || Boolean(onActivate);

  const handleActivate = () => {
    if (onActivate) {
      onActivate(item);
      return;
    }
    if (expandable) {
      setOpen((prev) => !prev);
      return;
    }
    if (item.detail_url) navigate(item.detail_url);
  };

  const ariaLabel = `${cfg.title} — ${description} — ${longDateWithTime(item.created_at)}`;

  return (
    <li
      aria-label={ariaLabel}
      onClick={interactive ? handleActivate : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleActivate();
              }
            }
          : undefined
      }
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-expanded={expandable ? open : undefined}
      className={cn(
        "group flex flex-col rounded-lg px-2 py-2.5 transition-colors",
        interactive &&
          "cursor-pointer hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
            cfg.bgClass,
          )}
          aria-hidden="true"
        >
          <Icon className={cn("h-5 w-5", cfg.textClass)} />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-sm font-medium text-foreground">{cfg.title}</span>
          <span className="line-clamp-2 text-xs text-muted-foreground">{description}</span>
          {!showActor && (
            <span className="text-[10px] text-muted-foreground">por {item.actor.user_name}</span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {showActor && (
            <Avatar
              size="xs"
              tone="muted"
              initials={getInitials(item.actor.user_name)}
              aria-label={item.actor.user_name}
            />
          )}
          <time
            dateTime={item.created_at}
            title={longDateWithTime(item.created_at)}
            className="text-[11px] text-muted-foreground font-tnum"
          >
            {relativeDate(item.created_at)}
          </time>
          {expandable && (
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-muted-foreground transition-transform",
                open && "rotate-180",
              )}
              aria-hidden="true"
            />
          )}
        </div>
      </div>
      {expandable && open && (
        <div className="mt-3 ml-13 grid grid-cols-2 gap-2 rounded-md border border-border bg-muted/30 p-3 text-xs">
          {Object.entries(item.payload).map(([k, v]) => (
            <div key={k} className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{k}</span>
              <span className="font-medium text-foreground">{String(v)}</span>
            </div>
          ))}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">actor</span>
            <span className="font-medium text-foreground">{item.actor.user_name}</span>
          </div>
        </div>
      )}
    </li>
  );
}