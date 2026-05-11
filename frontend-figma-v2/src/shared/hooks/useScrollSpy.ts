import { useEffect, useState } from "react";

/**
 * Tracks which section id is currently in viewport using IntersectionObserver.
 * Returns the id of the most recently activated section.
 *
 * Cross-feature hook (extracted from `features/design-system/hooks`). Same API.
 */
export function useScrollSpy(
  sectionIds: string[],
  rootMargin = "-20% 0px -70% 0px",
): string {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? "");

  useEffect(() => {
    if (sectionIds.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin, threshold: 0 },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds, rootMargin]);

  return activeId;
}
