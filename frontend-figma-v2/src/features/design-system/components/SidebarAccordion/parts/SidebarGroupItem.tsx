import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";
import type { DSNavGroup } from "../../../DesignSystem.types";
import { SidebarSectionLink } from "./SidebarSectionLink";

interface SidebarGroupItemProps {
  group: DSNavGroup;
  isOpen: boolean;
  activeId: string;
  onToggle: () => void;
  onSectionClick?: () => void;
}

export function SidebarGroupItem({
  group,
  isOpen,
  activeId,
  onToggle,
  onSectionClick,
}: SidebarGroupItemProps) {
  const { t } = useTranslation();
  const listRef = useRef<HTMLUListElement>(null);
  const panelId = `ds-sidebar-panel-${group.id}`;
  const headerId = `ds-sidebar-header-${group.id}`;

  const handleListKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    const list = listRef.current;
    if (!list) return;
    const links = Array.from(
      list.querySelectorAll<HTMLAnchorElement>("a[data-section-link]"),
    );
    if (links.length === 0) return;
    const currentIndex = links.findIndex((el) => el === document.activeElement);

    let nextIndex: number | null = null;
    switch (e.key) {
      case "ArrowDown":
        nextIndex = currentIndex < 0 ? 0 : Math.min(currentIndex + 1, links.length - 1);
        break;
      case "ArrowUp":
        nextIndex = currentIndex < 0 ? 0 : Math.max(currentIndex - 1, 0);
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = links.length - 1;
        break;
      default:
        return;
    }
    if (nextIndex !== null) {
      e.preventDefault();
      links[nextIndex]?.focus();
    }
  };

  return (
    <div className="border-b border-border last:border-b-0">
      <h3 className="m-0">
        <button
          id={headerId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset rounded-sm"
        >
          <span className="uppercase tracking-wider text-xs">{t(group.labelKey)}</span>
          <ChevronRight
            aria-hidden="true"
            className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
              isOpen ? "rotate-90" : ""
            }`}
          />
        </button>
      </h3>
      <ul
        id={panelId}
        ref={listRef}
        role="region"
        aria-labelledby={headerId}
        hidden={!isOpen}
        onKeyDown={handleListKeyDown}
        className="flex flex-col gap-0.5 pb-2"
      >
        {group.sections.map((section) => (
          <li key={section.id}>
            <SidebarSectionLink
              section={section}
              isActive={activeId === section.id}
              onSectionClick={onSectionClick}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
