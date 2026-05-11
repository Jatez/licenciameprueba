import { useDashboardData } from "@/modules/packages/dashboards/dashboard-v2/hooks/useDashboardData";
import { readMockScenario, MOCK_WALLET_INSUFFICIENT_BALANCE } from "@/api/mocks/licensing.mocks";

/**
 * Adapter for the wallet balance shown inside the licensing wizard.
 *
 * Currently sources from `useDashboardData("30d")`. When F-04 (wallet feature)
 * exposes a dedicated hook, swap the implementation here — consumers are stable.
 *
 * Honors the licensing `?mock=insufficient` scenario so the validation mock and
 * the displayed balance stay consistent inside the flow.
 */
export function useWalletBalance() {
  const { data, isLoading, isError, refetch } = useDashboardData("30d");
  const scenario = readMockScenario();

  const baseBalance = data?.wallet.balance ?? 0;
  const balance =
    scenario === "insufficient" ? MOCK_WALLET_INSUFFICIENT_BALANCE : baseBalance;

  return {
    balance,
    daysUntilExpiry: data?.wallet.daysUntilExpiry ?? null,
    expiresAt: data?.wallet.expiresAt ?? null,
    lowBalanceThreshold: data?.wallet.lowBalanceThreshold ?? 30,
    isLoading,
    isError,
    refetch,
  };
}
