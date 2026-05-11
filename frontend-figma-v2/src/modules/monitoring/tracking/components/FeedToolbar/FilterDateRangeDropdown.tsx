import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TrackingDateRangePreset } from "@/api/types";
import { useTrackingStore } from "@/stores/trackingStore";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";

const PRESETS: TrackingDateRangePreset[] = [
  "today",
  "last7",
  "last30",
  "last90",
];

export function FilterDateRangeDropdown() {
  const preset = useTrackingStore((s) => s.dateRangePreset);
  const setPreset = useTrackingStore((s) => s.setDateRangePreset);
  const t = trackingStrings.monitoring.toolbar;
  const labels = trackingStrings.monitoring.filters.dateRange;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <span className="text-xs text-muted-foreground">{t.filterDateRange}:</span>
          <span className="font-medium">{labels[preset]}</span>
          <ChevronDown size={14} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {PRESETS.map((p) => (
          <DropdownMenuItem
            key={p}
            onSelect={() => setPreset(p)}
            className={preset === p ? "font-medium" : ""}
          >
            {labels[p]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
