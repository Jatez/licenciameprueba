import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type { UserActivityFilterKey } from "@/shared/constants/activityTypes";

const VALID: UserActivityFilterKey[] = [
  "all",
  "licenses",
  "credits",
  "connections",
  "catalog",
  "reports",
];

/**
 * Reads/writes ?activity=all|licenses|credits|connections|catalog|reports.
 */
export function useActivityFilter(): {
  filter: UserActivityFilterKey;
  setFilter: (f: UserActivityFilterKey) => void;
} {
  const [params, setParams] = useSearchParams();
  const raw = params.get("activity");
  const filter: UserActivityFilterKey = (VALID as string[]).includes(raw ?? "")
    ? (raw as UserActivityFilterKey)
    : "all";

  const setFilter = useCallback(
    (next: UserActivityFilterKey) => {
      const newParams = new URLSearchParams(params);
      if (next === "all") newParams.delete("activity");
      else newParams.set("activity", next);
      setParams(newParams, { replace: true });
    },
    [params, setParams],
  );

  return { filter, setFilter };
}
