import { useEffect, useState } from "react";

/**
 * Returns a debounced copy of `value`. Updates `delayMs` after `value` settles.
 * Note: `useEffect` is the standard pattern for debouncing — this is NOT data
 * fetching, so the project rule against `useEffect`-based fetching does not
 * apply.
 */
export function useDebounceSearch(value: string, delayMs = 300): string {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}
