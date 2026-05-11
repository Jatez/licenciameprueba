/**
 * Build a sliding window of pages around `current`. Always includes first and
 * last; uses ellipsis (`"…"`) for gaps. Examples:
 *  - total 5, current 3      -> [1, 2, 3, 4, 5]
 *  - total 68, current 1     -> [1, 2, 3, 4, 5, "…", 68]
 *  - total 68, current 34    -> [1, "…", 33, 34, 35, "…", 68]
 *  - total 68, current 68    -> [1, "…", 64, 65, 66, 67, 68]
 */
export function buildPaginationRange(current: number, total: number): Array<number | "…"> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const range: Array<number | "…"> = [1];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);
  if (left > 2) range.push("…");
  for (let i = left; i <= right; i++) range.push(i);
  if (right < total - 1) range.push("…");
  range.push(total);
  return range;
}
