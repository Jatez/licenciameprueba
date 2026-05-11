import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DashboardPeriod } from "@/api/types.dashboard";

interface DashboardStore {
  selectedPeriod: DashboardPeriod;
  setSelectedPeriod: (p: DashboardPeriod) => void;

  dismissedAlertIds: string[];
  dismissAlert: (id: string) => void;
  resetDismissedAlerts: () => void;
}

/**
 * UI state for the V2 dashboard.
 * - `selectedPeriod` is persisted (user preference).
 * - `dismissedAlertIds` is intentionally NOT persisted so critical alerts
 *   reappear on each session.
 */
export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      selectedPeriod: "30d",
      setSelectedPeriod: (p) => set({ selectedPeriod: p }),

      dismissedAlertIds: [],
      dismissAlert: (id) =>
        set((s) => ({
          dismissedAlertIds: s.dismissedAlertIds.includes(id)
            ? s.dismissedAlertIds
            : [...s.dismissedAlertIds, id],
        })),
      resetDismissedAlerts: () => set({ dismissedAlertIds: [] }),
    }),
    {
      name: "licenciame-dashboard-period",
      partialize: (s) => ({ selectedPeriod: s.selectedPeriod }),
    },
  ),
);
