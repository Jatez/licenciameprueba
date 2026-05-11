/**
 * Billing endpoints — wired to the real backend.
 *
 * Mapping:
 *   getBillingProfile()  → GET  /auth/billing-profile
 *   saveBillingProfile() → PATCH /auth/billing-profile
 */

import { http } from "../http";
import type { BillingProfile } from "@/api/types";

export const billingApi = {
  async getBillingProfile(): Promise<BillingProfile | null> {
    try {
      const res = await http.get("/auth/billing-profile");
      return res.data as BillingProfile;
    } catch {
      return null;
    }
  },

  async saveBillingProfile(profile: BillingProfile): Promise<BillingProfile> {
    const res = await http.patch("/auth/billing-profile", profile);
    return res.data as BillingProfile;
  },
};
