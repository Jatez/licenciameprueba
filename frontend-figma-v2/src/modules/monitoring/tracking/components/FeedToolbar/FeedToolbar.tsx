import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTrackingStore } from "@/stores/trackingStore";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";
import { FilterStatusDropdown } from "./FilterStatusDropdown";
import { FilterPlatformsDropdown } from "./FilterPlatformsDropdown";
import { FilterDateRangeDropdown } from "./FilterDateRangeDropdown";

export function FeedToolbar() {
  const open = useTrackingStore((s) => s.openManualLinkDialog);
  const t = trackingStrings.monitoring.toolbar;

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <FilterStatusDropdown />
        <FilterPlatformsDropdown />
        <FilterDateRangeDropdown />
      </div>

      <Button onClick={() => open()} className="md:self-end">
        <Plus size={16} className="mr-1.5" aria-hidden="true" />
        {t.manualLinkCta}
      </Button>
    </div>
  );
}
