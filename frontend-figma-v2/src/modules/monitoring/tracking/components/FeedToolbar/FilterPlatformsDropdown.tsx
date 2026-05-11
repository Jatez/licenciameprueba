import { ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SocialPlatformF06 } from "@/api/types";
import { useTrackingStore } from "@/stores/trackingStore";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";
import { PlatformIcon } from "../shared/PlatformIcon";

const ALL_PLATFORMS: SocialPlatformF06[] = ["instagram", "tiktok", "facebook"];

export function FilterPlatformsDropdown() {
  const selected = useTrackingStore((s) => s.selectedPlatforms);
  const setPlatforms = useTrackingStore((s) => s.setPlatforms);
  const t = trackingStrings.monitoring.toolbar;
  const f = trackingStrings.monitoring.filters;

  const toggle = (p: SocialPlatformF06) => {
    if (selected.includes(p)) setPlatforms(selected.filter((x) => x !== p));
    else setPlatforms([...selected, p]);
  };

  const summary =
    selected.length === 0
      ? f.allPlatforms
      : selected.length === 1
        ? trackingStrings.syncStatus.platformLabels[selected[0]]
        : f.platformsCount.replace("{count}", String(selected.length));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <span className="text-xs text-muted-foreground">{t.filterPlatforms}:</span>
          <span className="font-medium">{summary}</span>
          <ChevronDown size={14} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>{t.filterPlatforms}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {ALL_PLATFORMS.map((p) => {
          const isOn = selected.includes(p);
          return (
            <button
              key={p}
              type="button"
              onClick={() => toggle(p)}
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
            >
              <span className="flex w-4 items-center justify-center">
                {isOn && <Check size={14} aria-hidden="true" />}
              </span>
              <PlatformIcon platform={p} withLabel size={14} />
            </button>
          );
        })}
        {selected.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <button
              type="button"
              onClick={() => setPlatforms([])}
              className="w-full px-2 py-1.5 text-left text-xs text-muted-foreground hover:bg-accent"
            >
              {f.allPlatforms}
            </button>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
