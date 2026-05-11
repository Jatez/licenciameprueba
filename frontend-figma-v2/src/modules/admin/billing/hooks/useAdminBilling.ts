import { useCallback, useMemo, useState } from "react";
import { adminBillingMocks } from "../mocks";
import { BILLING_DEFAULT_FILTERS, type AdminPayment, type BillingFiltersState } from "../types";

const DAY = 86_400_000;
const RANGE_MS: Record<BillingFiltersState["range"], number | null> = {
  "7d": 7 * DAY,
  "30d": 30 * DAY,
  "90d": 90 * DAY,
  all: null,
};

export function useAdminBilling() {
  const [payments, setPayments] = useState<AdminPayment[]>(adminBillingMocks);
  const [filters, setFilters] = useState<BillingFiltersState>(BILLING_DEFAULT_FILTERS);

  const resetFilters = useCallback(() => setFilters(BILLING_DEFAULT_FILTERS), []);

  const reconcile = useCallback((id: string) => {
    setPayments((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: "paid", paidAt: p.paidAt ?? new Date().toISOString(), reconciledByName: "Camila Soto" }
          : p,
      ),
    );
  }, []);

  const markFailed = useCallback((id: string) => {
    setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, status: "failed" } : p)));
  }, []);

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    const rangeMs = RANGE_MS[filters.range];
    const minTs = rangeMs ? Date.now() - rangeMs : 0;
    return payments.filter((p) => {
      if (filters.status !== "all" && p.status !== filters.status) return false;
      if (filters.method !== "all" && p.method !== filters.method) return false;
      if (rangeMs && new Date(p.createdAt).getTime() < minTs) return false;
      if (q) {
        const blob = `${p.invoiceNumber} ${p.companyName} ${p.bankReference ?? ""}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [payments, filters]);

  const stats = useMemo(() => {
    const monthAgo = Date.now() - 30 * DAY;
    return {
      revenue30d: payments
        .filter((p) => p.status === "paid" && new Date(p.createdAt).getTime() >= monthAgo)
        .reduce((acc, p) => acc + p.amountTotalCop, 0),
      pending: payments.filter((p) => p.status === "pending" || p.status === "processing").length,
      failed: payments.filter((p) => p.status === "failed").length,
      creditNotes: payments.filter(
        (p) => p.status === "refunded" && new Date(p.createdAt).getTime() >= monthAgo,
      ).length,
    };
  }, [payments]);

  return { payments, filtered, filters, setFilters, resetFilters, stats, reconcile, markFailed };
}
