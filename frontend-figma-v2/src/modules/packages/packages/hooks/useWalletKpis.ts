import { useMemo } from "react";
import { useWalletAggregate } from "./index";

export interface WalletKpis {
  /** Credits currently available across all active bags. */
  balance: number;
  /** Credits ever consumed across the company's lifetime. */
  consumed: number;
  /** Credits ever purchased across the company's lifetime. */
  totalPurchased: number;
  /** Months until the earliest active bag expires. Null when no active bag. */
  monthsUntilEarliestExpiry: number | null;
  /** Total number of active bags. */
  activeBagsCount: number;
}

/**
 * Derived KPIs for the Wallet Hub. Pulls from `useWalletAggregate` only —
 * no new endpoint, no extra round-trip.
 */
export function useWalletKpis() {
  const query = useWalletAggregate();

  const kpis = useMemo<WalletKpis | null>(() => {
    if (!query.data) return null;
    const { balance, totalPurchased, bags, daysUntilEarliestExpiry } =
      query.data;
    const activeBags = bags.filter((b) => b.status === "active");
    return {
      balance,
      consumed: Math.max(0, totalPurchased - balance),
      totalPurchased,
      monthsUntilEarliestExpiry:
        daysUntilEarliestExpiry != null
          ? Math.max(0, Math.round(daysUntilEarliestExpiry / 30))
          : null,
      activeBagsCount: activeBags.length,
    };
  }, [query.data]);

  return {
    kpis,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
