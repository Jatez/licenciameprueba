/**
 * Low-balance threshold for the wallet hub.
 * When balance < threshold, the UI surfaces `LowBalanceAlert`.
 *
 * NOTE (hand-off): F-05 (low-balance notifications) will reuse this constant
 * to drive in-app/email alerts. Keep this file as the single source of truth
 * so the threshold stays consistent across UI surfaces.
 */
export const LOW_BALANCE_THRESHOLD = 50;

export function isBalanceLow(balance: number): boolean {
  return balance < LOW_BALANCE_THRESHOLD;
}
