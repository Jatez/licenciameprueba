import * as authApi from "./endpoints/auth";
import * as dashboardApi from "./endpoints/dashboard";
import { getDashboardDataV2 } from "./endpoints/dashboardV2";
import { catalogApi } from "./endpoints/catalog";
import { licensingApi } from "./endpoints/licensing";
import { trackingApi } from "./endpoints/tracking";
import { packagesApi } from "./endpoints/packages";
import { billingApi } from "./endpoints/billing";
import { socialApi } from "./endpoints/social";

export const api = {
  auth: authApi,
  dashboard: dashboardApi,
  dashboardV2: { getData: getDashboardDataV2 },
  catalog: catalogApi,
  licensing: licensingApi,
  tracking: trackingApi,
  packages: packagesApi,
  billing: billingApi,
  social: socialApi,
} as const;

export type Api = typeof api;

export * from "./types";
export * as dashboardTypes from "./types.dashboard";
export { isApiError } from "./client";
