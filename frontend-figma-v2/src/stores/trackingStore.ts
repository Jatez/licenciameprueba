/**
 * Tracking UI store. Session-only — never persisted.
 */
import { create } from "zustand";
import type {
  DetectedPost,
  SocialPlatformF06,
  TrackingDateRangePreset,
  TrackingFeedFilter,
} from "@/api/types";
import { resolveDateRangePreset } from "@/modules/monitoring/tracking/utils/dateRangePresets";

interface TrackingStoreState {
  // Feed filters
  selectedFilter: TrackingFeedFilter;
  selectedPlatforms: SocialPlatformF06[];
  dateRangePreset: TrackingDateRangePreset;
  dateRange: { from: string | null; to: string | null };
  currentPage: number;
  setFilter: (filter: TrackingFeedFilter) => void;
  setPlatforms: (platforms: SocialPlatformF06[]) => void;
  setDateRangePreset: (preset: TrackingDateRangePreset) => void;
  setCustomDateRange: (range: { from: string | null; to: string | null }) => void;
  setCurrentPage: (page: number) => void;
  resetFilters: () => void;

  // Manual link dialog
  manualLinkDialogOpen: boolean;
  manualLinkLicenseId: string | null;
  manualLinkPrefill: {
    externalUrl?: string;
    platform?: SocialPlatformF06;
    publishedAt?: string;
  } | null;
  openManualLinkDialog: (
    licenseId?: string,
    prefill?: TrackingStoreState["manualLinkPrefill"],
  ) => void;
  closeManualLinkDialog: () => void;

  // Dev panel
  devPanelOpen: boolean;
  setDevPanelOpen: (open: boolean) => void;

  // Detection toast queue (consumed by DetectionToastsContainer)
  recentDetectionToastQueue: DetectedPost[];
  pushDetectionToast: (post: DetectedPost) => void;
  dismissDetectionToast: (postId: string) => void;

  reset: () => void;
}

const DEFAULT_PRESET: TrackingDateRangePreset = "last30";

const INITIAL_STATE = {
  selectedFilter: "all" as TrackingFeedFilter,
  selectedPlatforms: [] as SocialPlatformF06[],
  dateRangePreset: DEFAULT_PRESET,
  dateRange: resolveDateRangePreset(DEFAULT_PRESET),
  currentPage: 1,
  manualLinkDialogOpen: false,
  manualLinkLicenseId: null as string | null,
  manualLinkPrefill: null as TrackingStoreState["manualLinkPrefill"],
  devPanelOpen: false,
  recentDetectionToastQueue: [] as DetectedPost[],
};

export const useTrackingStore = create<TrackingStoreState>((set) => ({
  ...INITIAL_STATE,

  setFilter: (filter) => set({ selectedFilter: filter, currentPage: 1 }),
  setPlatforms: (platforms) => set({ selectedPlatforms: platforms, currentPage: 1 }),
  setDateRangePreset: (preset) =>
    set({
      dateRangePreset: preset,
      dateRange:
        preset === "custom"
          ? { from: null, to: null }
          : resolveDateRangePreset(preset),
      currentPage: 1,
    }),
  setCustomDateRange: (range) =>
    set({ dateRangePreset: "custom", dateRange: range, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),
  resetFilters: () =>
    set({
      selectedFilter: "all",
      selectedPlatforms: [],
      dateRangePreset: DEFAULT_PRESET,
      dateRange: resolveDateRangePreset(DEFAULT_PRESET),
      currentPage: 1,
    }),

  openManualLinkDialog: (licenseId, prefill) =>
    set({
      manualLinkDialogOpen: true,
      manualLinkLicenseId: licenseId ?? null,
      manualLinkPrefill: prefill ?? null,
    }),
  closeManualLinkDialog: () =>
    set({
      manualLinkDialogOpen: false,
      manualLinkLicenseId: null,
      manualLinkPrefill: null,
    }),

  setDevPanelOpen: (open) => set({ devPanelOpen: open }),

  pushDetectionToast: (post) =>
    set((state) => ({
      recentDetectionToastQueue: [post, ...state.recentDetectionToastQueue].slice(0, 5),
    })),
  dismissDetectionToast: (postId) =>
    set((state) => ({
      recentDetectionToastQueue: state.recentDetectionToastQueue.filter((p) => p.id !== postId),
    })),

  reset: () => set({ ...INITIAL_STATE }),
}));
