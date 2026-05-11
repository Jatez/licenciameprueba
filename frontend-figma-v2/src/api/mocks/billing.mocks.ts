/**
 * Billing profile mock store (F-04 · Block 2).
 *
 * In-memory only. Hand-off: backend persists by companyId.
 * `?billing=empty` → simulates first-time flow with no profile.
 */
import type { BillingProfile } from "@/api/types";

const SEED_PROFILE: BillingProfile = {
  legalName: "Marca Demo S.A.S.",
  taxId: "900.123.456-7",
  taxpayerType: "juridica",
  taxRegime: "responsable-iva",
  billingEmail: "compras@marcademo.co",
  fiscalAddress: "Calle 93 # 11-13, Oficina 502",
  city: "Bogotá D.C.",
  country: "COL",
  contactName: "Andrea Vargas",
  contactPhone: "+57 3001234567",
};

let storedProfile: BillingProfile | null = SEED_PROFILE;

function readBillingScenario(): "default" | "empty" {
  if (typeof window === "undefined") return "default";
  const sp = new URLSearchParams(window.location.search);
  return sp.get("billing") === "empty" ? "empty" : "default";
}

export function getBillingProfileMock(): BillingProfile | null {
  if (readBillingScenario() === "empty") return null;
  return storedProfile;
}

export function saveBillingProfileMock(profile: BillingProfile): BillingProfile {
  storedProfile = profile;
  return storedProfile;
}
