/**
 * F-09 · Admin Companies — types (mock contract).
 */

export type CompanyStatus = "active" | "suspended" | "overdue";
export type CompanyPlanTier = "bolsa-a" | "bolsa-b" | "bolsa-c" | "custom";

export interface CompanyWalletSnapshot {
  creditsAvailable: number;
  creditsConsumed: number;
  creditsTotal: number;
  expiresAt: string | null;
  lastTopUpAt: string | null;
}

export interface CompanyLicenseRow {
  id: string;
  trackTitle: string;
  trackArtist: string;
  status: "active" | "consumed" | "expired";
  issuedAt: string;
}

export interface CompanyPaymentRow {
  id: string;
  invoiceNumber: string;
  amountCop: number;
  status: "paid" | "pending" | "failed";
  createdAt: string;
}

export interface CompanyUserRow {
  id: string;
  fullName: string;
  email: string;
  role: "empresa_admin" | "empresa_user";
  status: "active" | "suspended" | "pending_mfa";
}

export interface AdminCompany {
  id: string;
  name: string;
  legalName: string;
  taxId: string;
  industry: string;
  city: string;
  status: CompanyStatus;
  plan: CompanyPlanTier;
  planLabel: string;
  joinedAt: string;
  primaryContactName: string;
  primaryContactEmail: string;
  wallet: CompanyWalletSnapshot;
  activeLicenses: number;
  monthlySpendCop: number;
  licenses: CompanyLicenseRow[];
  payments: CompanyPaymentRow[];
  users: CompanyUserRow[];
}

export interface CompaniesFiltersState {
  search: string;
  status: "all" | CompanyStatus;
  plan: "all" | CompanyPlanTier;
}

export const COMPANIES_DEFAULT_FILTERS: CompaniesFiltersState = {
  search: "",
  status: "all",
  plan: "all",
};
