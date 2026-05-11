export function calculateResultingBalance(balance: number, cost: number): number {
  return Math.max(0, balance - cost);
}
