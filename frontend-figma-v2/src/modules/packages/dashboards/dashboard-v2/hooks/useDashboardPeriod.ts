import { useDashboardStore } from "@/stores/dashboardStore";
import { buildRange } from "../utils/periodRanges";

export function useDashboardPeriod() {
  const selectedPeriod = useDashboardStore((s) => s.selectedPeriod);
  const setSelectedPeriod = useDashboardStore((s) => s.setSelectedPeriod);
  const range = buildRange(selectedPeriod);
  return { selectedPeriod, setSelectedPeriod, range };
}
