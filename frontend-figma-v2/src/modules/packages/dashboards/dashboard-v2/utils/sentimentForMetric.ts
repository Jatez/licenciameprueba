import type { KpiId, KpiSentiment, KpiDirection } from "@/api/types.dashboard";

/**
 * Decide if a delta direction is good/bad/neutral based on which metric it is.
 * Example: balance going DOWN is negative; tracked-posts going UP is positive.
 */
export function sentimentForKpi(id: KpiId, direction: KpiDirection): KpiSentiment {
  if (direction === "flat") return "neutral";
  switch (id) {
    case "balance":
      return direction === "up" ? "positive" : "negative";
    case "active-licenses":
    case "tracked-posts":
      return direction === "up" ? "positive" : "negative";
    case "bag-validity":
      return "neutral";
  }
}
