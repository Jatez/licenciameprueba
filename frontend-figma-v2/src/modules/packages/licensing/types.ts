import type { LicenseUsageType } from "@/api/types";

export type UsageTypeCardState =
  | "available"
  | "selected"
  | "disabled-licensability"
  | "disabled-credits";

export interface UsageTypeCardViewModel {
  id: LicenseUsageType;
  title: string;
  description: string;
  example: string;
  iconName: string;
  creditCost: number;
  state: UsageTypeCardState;
  disabledReason: string | null;
}
