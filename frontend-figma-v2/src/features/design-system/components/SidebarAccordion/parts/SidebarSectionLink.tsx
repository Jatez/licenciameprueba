import { useTranslation } from "react-i18next";
import type { DSNavSection } from "../../../DesignSystem.types";

interface SidebarSectionLinkProps {
  section: DSNavSection;
  isActive: boolean;
  onSectionClick?: () => void;
}

export function SidebarSectionLink({
  section,
  isActive,
  onSectionClick,
}: SidebarSectionLinkProps) {
  const { t } = useTranslation();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById(section.id);
    if (el) {
      window.history.replaceState(null, "", `#${section.id}`);
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    onSectionClick?.();
  };

  return (
    <a
      href={`#${section.id}`}
      onClick={handleClick}
      aria-current={isActive ? "true" : undefined}
      data-section-link
      className={`block text-sm pl-6 pr-3 py-1.5 border-l-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset ${
        isActive
          ? "bg-primary/15 text-foreground font-medium border-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/50 border-transparent font-normal"
      }`}
    >
      {t(section.labelKey)}
    </a>
  );
}
