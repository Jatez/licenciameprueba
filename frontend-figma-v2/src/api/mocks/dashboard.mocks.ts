import type { DashboardData } from "../types";

/** Empty dashboard for newly registered users — drives empty states. */
export const mockDashboardEmpty: DashboardData = {
  wallet: { balance: 0, expiresAt: null },
  licenses: [],
  socialAccounts: [],
  metrics: { publicationsCount: 0, totalImpressions: 0 },
};
