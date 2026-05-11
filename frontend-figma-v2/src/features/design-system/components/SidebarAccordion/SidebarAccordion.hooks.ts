import { useCallback, useEffect, useState } from "react";
import type {
  UseOpenGroupsOptions,
  UseOpenGroupsResult,
} from "./SidebarAccordion.types";

function readStoredGroups(storageKey: string): string[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter((v): v is string => typeof v === "string");
  } catch {
    return null;
  }
}

function persistGroups(storageKey: string, groups: Set<string>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(Array.from(groups)));
  } catch {
    // ignore quota / privacy errors
  }
}

export function useOpenGroups({
  groupIds,
  defaultOpen,
  mode,
  storageKey,
}: UseOpenGroupsOptions): UseOpenGroupsResult {
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => {
    const stored = readStoredGroups(storageKey);
    const validIds = new Set(groupIds);
    let initial: string[];
    if (stored && stored.length > 0) {
      initial = stored.filter((id) => validIds.has(id));
    } else {
      initial = defaultOpen.filter((id) => validIds.has(id));
    }
    if (mode === "single" && initial.length > 1) {
      initial = [initial[0]];
    }
    return new Set(initial);
  });

  useEffect(() => {
    persistGroups(storageKey, openGroups);
  }, [openGroups, storageKey]);

  const toggleGroup = useCallback(
    (id: string) => {
      setOpenGroups((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          if (mode === "single") next.clear();
          next.add(id);
        }
        return next;
      });
    },
    [mode],
  );

  const openGroup = useCallback(
    (id: string) => {
      setOpenGroups((prev) => {
        if (prev.has(id)) return prev;
        const next = mode === "single" ? new Set<string>() : new Set(prev);
        next.add(id);
        return next;
      });
    },
    [mode],
  );

  return { openGroups, toggleGroup, openGroup };
}
