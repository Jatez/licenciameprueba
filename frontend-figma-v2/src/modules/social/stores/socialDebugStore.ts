/**
 * Local UI store for the F-07 demo panel.
 *
 * Toggles here ONLY drive the simulated mock layer (popup blocked, account
 * already taken, force token expired, sync network errors, permissions
 * revoked, duplicate account). They never reach any real backend. Safe to
 * delete the panel without breaking the app.
 */
import { create } from "zustand";

export type SocialDebugFlag =
  | "popupBlocked"
  | "accountTaken"
  | "forceInstagramExpired"
  | "syncNetworkError"
  | "simulatePermissionsRevoked"
  | "simulateDuplicateAccount";

export interface SocialDebugState {
  popupBlocked: boolean;
  accountTaken: boolean;
  forceInstagramExpired: boolean;
  syncNetworkError: boolean;
  simulatePermissionsRevoked: boolean;
  simulateDuplicateAccount: boolean;
  panelOpen: boolean;
  setFlag: (key: SocialDebugFlag, value: boolean) => void;
  setPanelOpen: (open: boolean) => void;
  togglePanel: () => void;
  reset: () => void;
}

const INITIAL: Pick<
  SocialDebugState,
  | "popupBlocked"
  | "accountTaken"
  | "forceInstagramExpired"
  | "syncNetworkError"
  | "simulatePermissionsRevoked"
  | "simulateDuplicateAccount"
> = {
  popupBlocked: false,
  accountTaken: false,
  forceInstagramExpired: false,
  syncNetworkError: false,
  simulatePermissionsRevoked: false,
  simulateDuplicateAccount: false,
};

export const useSocialDebugStore = create<SocialDebugState>((set) => ({
  ...INITIAL,
  panelOpen: false,
  setFlag: (key, value) => set({ [key]: value } as Partial<SocialDebugState>),
  setPanelOpen: (open) => set({ panelOpen: open }),
  togglePanel: () => set((s) => ({ panelOpen: !s.panelOpen })),
  reset: () => set({ ...INITIAL }),
}));
