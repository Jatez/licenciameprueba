import { create } from "zustand";

interface SidebarState {
  isOpen: boolean;
  /** Number of mounted AppPageHeader instances. >0 hides the BodyCard fallback hamburger. */
  headerMountCount: number;
  open: () => void;
  close: () => void;
  toggle: () => void;
  registerHeader: () => void;
  unregisterHeader: () => void;
}

/** Controls the mobile sidebar Sheet. UI state only — never persists. */
export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: false,
  headerMountCount: 0,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  registerHeader: () => set((s) => ({ headerMountCount: s.headerMountCount + 1 })),
  unregisterHeader: () =>
    set((s) => ({ headerMountCount: Math.max(0, s.headerMountCount - 1) })),
}));
