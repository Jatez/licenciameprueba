import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NAV_GROUPS } from "../config/navigation";
import type { DSNavGroup } from "../DesignSystem.types";

/**
 * Filters navigation groups by user query (matches group label or section label).
 * Returns the visible section ids and the filtered groups.
 */
export function useSearchFilter(query: string): { visibleIds: Set<string>; filteredGroups: DSNavGroup[] } {
  const { t } = useTranslation();

  return useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      const all = new Set<string>();
      NAV_GROUPS.forEach((g) => g.sections.forEach((s) => all.add(s.id)));
      return { visibleIds: all, filteredGroups: NAV_GROUPS };
    }

    const visibleIds = new Set<string>();
    const filteredGroups: DSNavGroup[] = NAV_GROUPS.map((group) => {
      const groupLabel = t(group.labelKey).toLowerCase();
      const groupMatches = groupLabel.includes(q);
      const matchedSections = group.sections.filter((s) => {
        const label = t(s.labelKey).toLowerCase();
        return groupMatches || label.includes(q);
      });
      matchedSections.forEach((s) => visibleIds.add(s.id));
      return { ...group, sections: matchedSections };
    }).filter((g) => g.sections.length > 0);

    return { visibleIds, filteredGroups };
  }, [query, t]);
}
