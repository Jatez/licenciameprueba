/**
 * F-09 · Admin Billing — types.
 */

export type PaymentStatus = "paid" | "pending" | "processing" | "failed" | "refunded" | "disputed";
export type PaymentMethod = "pse" | "transfer" | "card" | "credit_note";

export type PaymentTimelineEventType =
  | "created"
  | "processing"
  | "paid"
  | "failed"
  | "refunded"
  | "reconciled"
  | "credit_note_issued";

export interface PaymentTimelineEvent {
  id: string;
  timestamp: string;
  type: PaymentTimelineEventType;
  title: string;
  description?: string;
  actor?: string;
}

export interface AdminPayment {
  id: string;
  invoiceNumber: string;
  companyId: string;
  companyName: string;
  companyTaxId: string; // NIT
  companyAddress: string;
  packageName: string;
  creditsPurchased: number;
  amountSubtotalCop: number;
  amountIvaCop: number;
  amountTotalCop: number;
  method: PaymentMethod;
  status: PaymentStatus;
  bankReference: string | null;
  errorReason?: string;
  createdAt: string;
  paidAt: string | null;
  reconciledByName?: string;
  timeline: PaymentTimelineEvent[];
}

export interface BillingFiltersState {
  search: string;
  status: "all" | PaymentStatus;
  method: "all" | PaymentMethod;
  range: "7d" | "30d" | "90d" | "all";
}

export const BILLING_DEFAULT_FILTERS: BillingFiltersState = {
  search: "",
  status: "all",
  method: "all",
  range: "30d",
};
