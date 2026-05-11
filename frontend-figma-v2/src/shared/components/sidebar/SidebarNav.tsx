import { LucideIcon } from "lucide-react";
import { SidebarNavItem } from "./SidebarNavItem";

export interface SidebarNavEntry {
  icon: LucideIcon;
  label: string;
  href: string;
  active?: boolean;
  badgeCount?: number;
  /** Stable identifier injected as `data-tour-target` for the onboarding spotlight. */
  tourTarget?: string;
}

interface SidebarNavProps {
  items: SidebarNavEntry[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  return (
    <nav className="flex-1 flex flex-col gap-1 pr-3">
      {items.map((item) => (
        <SidebarNavItem
          key={item.label}
          icon={item.icon}
          label={item.label}
          href={item.href}
          active={item.active}
          badgeCount={item.badgeCount}
          tourTarget={item.tourTarget}
        />
      ))}
    </nav>
  );
}
