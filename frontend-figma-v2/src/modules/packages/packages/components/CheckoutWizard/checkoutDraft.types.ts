import type {
  BillingProfile,
  CreditPackageId,
  PaymentMethod,
  PurchaseErrorCode,
} from "@/api/types";

export type CheckoutStep = 1 | 2 | 3 | 4 | 5;

export type CheckoutResultStatus =
  | "idle"
  | "processing"
  | "approved"
  | "rejected"
  | "pending"
  | "network-error";

export interface CheckoutCardFields {
  cardholderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  /** Sanitized out before persisting to localStorage. */
  cvv: string;
  forceFailure?: boolean;
}

export interface CheckoutDraft {
  step: CheckoutStep;
  packageId: CreditPackageId | null;
  billing: BillingProfile | null;
  paymentMethod: PaymentMethod | null;
  cardData: Partial<CheckoutCardFields> | null;
  termsAccepted: boolean;
  quoteId: string | null;
  purchaseId: string | null;
  resultStatus: CheckoutResultStatus;
  failureCode: PurchaseErrorCode | null;
  /** ISO timestamp; used for TTL. */
  updatedAt: string;
}

export const EMPTY_DRAFT: CheckoutDraft = {
  step: 1,
  packageId: null,
  billing: null,
  paymentMethod: null,
  cardData: null,
  termsAccepted: false,
  quoteId: null,
  purchaseId: null,
  resultStatus: "idle",
  failureCode: null,
  updatedAt: new Date().toISOString(),
};
