import { useMemo } from "react";
import type { License } from "@/api/types";

export type NotCancellableReason =
  | "window-expired"
  | "already-consumed"
  | "already-cancelled"
  | "already-expired";

export interface CancellableState {
  isCancellable: boolean;
  reason: NotCancellableReason | null;
  hoursRemaining: number;
}

export function useIsCancellable(license: License | undefined): CancellableState {
  return useMemo(() => {
    if (!license) {
      return { isCancellable: false, reason: null, hoursRemaining: 0 };
    }
    if (license.status === "consumed") {
      return { isCancellable: false, reason: "already-consumed", hoursRemaining: 0 };
    }
    if (license.status === "cancelled") {
      return { isCancellable: false, reason: "already-cancelled", hoursRemaining: 0 };
    }
    if (license.status === "expired") {
      return { isCancellable: false, reason: "already-expired", hoursRemaining: 0 };
    }
    if (!license.cancellableUntil) {
      return { isCancellable: false, reason: "window-expired", hoursRemaining: 0 };
    }
    const remainingMs = new Date(license.cancellableUntil).getTime() - Date.now();
    if (remainingMs <= 0) {
      return { isCancellable: false, reason: "window-expired", hoursRemaining: 0 };
    }
    return {
      isCancellable: true,
      reason: null,
      hoursRemaining: Math.max(1, Math.ceil(remainingMs / 3600_000)),
    };
  }, [license]);
}
