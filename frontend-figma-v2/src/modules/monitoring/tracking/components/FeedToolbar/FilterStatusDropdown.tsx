import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TrackingFeedFilter } from "@/api/types";
import { useTrackingStore } from "@/stores/trackingStore";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";

const FILTERS: TrackingFeedFilter[] = [
  "all",
  "pending-match",
  "matched-auto",
  "matched-manual",
  "no-match-found",
  "unlinked",
];

export function FilterStatusDropdown() {
  const value = useTrackingStore((s) => s.selectedFilter);
  const set = useTrackingStore((s) => s.setFilter);
  const t = trackingStrings.monitoring.toolbar;
  const labels = t.filterStatusOptions;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <span className="text-xs text-muted-foreground">{t.filterStatus}:</span>
          <span className="font-medium">{labels[value]}</span>
          <ChevronDown size={14} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {FILTERS.map((f) => (
          <DropdownMenuItem
            key={f}
            onSelect={() => set(f)}
            className={value === f ? "font-medium" : ""}
          >
            {labels[f]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
