import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

export interface SidebarNavItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  active?: boolean;
  /** Force a visual state (used in the style-guide showcase) */
  forceState?: "default" | "hover" | "active";
  onClick?: () => void;
  badgeCount?: number;
  /** Rendered as `data-tour-target` so the onboarding tour can anchor to this row. */
  tourTarget?: string;
}

export function SidebarNavItem({
  icon: Icon,
  label,
  href,
  active = false,
  forceState,
  onClick,
  badgeCount,
  tourTarget,
}: SidebarNavItemProps) {
  const state = forceState ?? (active ? "active" : "default");

  const base =
    "flex items-center gap-2.5 py-2.5 text-sm transition-colors";
  const styles =
    state === "active"
      ? "bg-primary text-ink-900 font-medium pl-7 rounded-r-full"
      : state === "hover"
        ? "text-ink-900/80 bg-ink-900/5 pl-5 ml-2 rounded-md"
        : "text-ink-900/60 hover:text-ink-900/80 hover:bg-ink-900/5 pl-5 ml-2 rounded-md";

  const showBadge = typeof badgeCount === "number" && badgeCount > 0;
  const badgeText = showBadge ? (badgeCount! > 9 ? "9+" : String(badgeCount)) : "";

  return (
    <Link
      to={href}
      onClick={onClick}
      className={`${base} ${styles}`}
      data-tour-target={tourTarget}
    >
      <Icon size={18} />
      <span className="flex-1">{label}</span>
      {showBadge && (
        <span
          aria-label={`${badgeCount} pendientes`}
          className="mr-3 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-error-subtle px-1.5 text-[11px] font-semibold text-foreground"
        >
          {badgeText}
        </span>
      )}
    </Link>
  );
}
