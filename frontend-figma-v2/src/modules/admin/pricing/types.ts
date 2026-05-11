export type PricingTierKey = "bolsa-a" | "bolsa-b" | "bolsa-c";

export interface PricingPackage {
  key: PricingTierKey;
  name: string;
  tagline: string;
  priceCop: number;
  credits: number;
  validityMonths: number;
  pricePerCreditCop: number;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

export interface CustomPackageDraft {
  companyName: string;
  credits: number;
  priceCop: number;
  validityMonths: number;
  notes: string;
}
