import { useDashboardData } from "@/modules/packages/dashboards/dashboard-v2/hooks/useDashboardData";

/**
 * Adapter for the wallet balance shown inside the licensing wizard.
 * Source: `useDashboardData("30d")` → `/api/v2/metrics/overview`.
 * En error de red devuelve 0 para no inducir falsos positivos.
 */
export function useWalletBalance() {
  const { data, isLoading, isError, refetch } = useDashboardData("30d");

  return {
    balance: data?.wallet.balance ?? 0,
    daysUntilExpiry: data?.wallet.daysUntilExpiry ?? null,
    expiresAt: data?.wallet.expiresAt ?? null,
    lowBalanceThreshold: data?.wallet.lowBalanceThreshold ?? 30,
    isLoading,
    isError,
    refetch,
  };
}
