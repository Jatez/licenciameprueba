import type { DSNavGroup } from "../DesignSystem.types";
import { SidebarAccordion } from "./SidebarAccordion";
import { DSSidebarFooter } from "./DSSidebarFooter";

interface DSSidebarProps {
  groups: DSNavGroup[];
  activeId: string;
  isOpen: boolean;
  onClose: () => void;
  forceOpenAll?: boolean;
}

export function DSSidebar({
  groups,
  activeId,
  isOpen,
  onClose,
  forceOpenAll = false,
}: DSSidebarProps) {
  return (
    <>
      <aside
        role="navigation"
        aria-label="Design System navigation"
        className={`fixed top-[60px] left-0 w-56 h-[calc(100vh-60px)] bg-card border-r border-border overflow-y-auto z-40 transition-transform duration-200 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <nav className="flex-1 py-3">
          <SidebarAccordion
            groups={groups}
            activeId={activeId}
            mode="multi"
            forceOpenAll={forceOpenAll}
            onSectionClick={onClose}
          />
        </nav>
        <DSSidebarFooter />
      </aside>
      {isOpen && (
        <div
          className="fixed inset-0 bg-lm-black/20 z-30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
    </>
  );
}
