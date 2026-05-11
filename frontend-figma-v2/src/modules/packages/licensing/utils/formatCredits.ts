/** "1 crédito" / "N créditos". Pure presentation. */
export function formatCredits(n: number): string {
  return n === 1 ? "1 crédito" : `${n} créditos`;
}
