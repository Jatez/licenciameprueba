import type { DSNavGroup } from "../../DesignSystem.types";

export type SidebarAccordionMode = "single" | "multi";

export interface SidebarAccordionProps {
  groups: DSNavGroup[];
  activeId: string;
  mode?: SidebarAccordionMode;
  forceOpenAll?: boolean;
  onSectionClick?: () => void;
}

export interface UseOpenGroupsOptions {
  groupIds: string[];
  defaultOpen: string[];
  mode: SidebarAccordionMode;
  storageKey: string;
}

export interface UseOpenGroupsResult {
  openGroups: Set<string>;
  toggleGroup: (id: string) => void;
  openGroup: (id: string) => void;
}
