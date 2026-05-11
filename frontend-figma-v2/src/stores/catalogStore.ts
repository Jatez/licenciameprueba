import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CatalogViewMode = "grid" | "list";

interface CatalogStore {
  /** Mobile filters drawer open state (ephemeral). */
  isFiltersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;

  /** View mode persists across sessions. */
  viewMode: CatalogViewMode;
  setViewMode: (mode: CatalogViewMode) => void;
}

/**
 * Ephemeral UI state for the catalog page.
 * Filters, search, page, pageSize and sort live in the URL — NOT here.
 */
export const useCatalogStore = create<CatalogStore>()(
  persist(
    (set) => ({
      isFiltersOpen: false,
      setFiltersOpen: (open) => set({ isFiltersOpen: open }),

      viewMode: "list",
      setViewMode: (mode) => set({ viewMode: mode }),
    }),
    {
      name: "licenciame-catalog-view",
      partialize: (s) => ({ viewMode: s.viewMode }),
    },
  ),
);
