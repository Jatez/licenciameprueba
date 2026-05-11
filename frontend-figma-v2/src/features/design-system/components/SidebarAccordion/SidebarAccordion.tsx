import { useEffect, useMemo, useRef } from "react";
import { useOpenGroups } from "./SidebarAccordion.hooks";
import { SidebarGroupItem } from "./parts/SidebarGroupItem";
import type { SidebarAccordionProps } from "./SidebarAccordion.types";

const STORAGE_KEY = "ds-sidebar-open-groups";
const DEFAULT_OPEN = ["get-started"];

export function SidebarAccordion({
  groups,
  activeId,
  mode = "multi",
  forceOpenAll = false,
  onSectionClick,
}: SidebarAccordionProps) {
  const groupIds = useMemo(() => groups.map((g) => g.id), [groups]);

  const { openGroups, toggleGroup, openGroup } = useOpenGroups({
    groupIds,
    defaultOpen: DEFAULT_OPEN,
    mode,
    storageKey: STORAGE_KEY,
  });

  // Auto-open the group containing the active section ONLY on first activation.
  // After the user toggles a group closed, scroll-spy must NOT re-open it.
  const didInitialAutoOpen = useRef(false);
  useEffect(() => {
    if (didInitialAutoOpen.current) return;
    if (!activeId) return;
    const owning = groups.find((g) => g.sections.some((s) => s.id === activeId));
    if (owning && !openGroups.has(owning.id)) {
      openGroup(owning.id);
    }
    didInitialAutoOpen.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, groups]);

  const allOpenIds = useMemo(
    () => new Set(forceOpenAll ? groupIds : []),
    [forceOpenAll, groupIds],
  );

  return (
    <div className="flex flex-col">
      {groups.map((group) => {
        const isOpen = forceOpenAll ? allOpenIds.has(group.id) : openGroups.has(group.id);
        return (
          <SidebarGroupItem
            key={group.id}
            group={group}
            isOpen={isOpen}
            activeId={activeId}
            onToggle={() => toggleGroup(group.id)}
            onSectionClick={onSectionClick}
          />
        );
      })}
    </div>
  );
}
