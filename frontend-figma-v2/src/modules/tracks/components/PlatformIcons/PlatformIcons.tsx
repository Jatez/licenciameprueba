import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PlatformBadge } from "@/components/ui/platform-badge";
import { cn } from "@/lib/utils";
import type { LicensablePlatform } from "@/api/types";
import { catalogStrings } from "@/modules/tracks/strings";
import { interpolate } from "@/modules/tracks/utils";

const ALL_PLATFORMS: LicensablePlatform[] = ["instagram", "tiktok", "facebook"];

interface PlatformIconsProps {
  licensable: LicensablePlatform[];
  size?: "sm" | "md";
}

export function PlatformIcons({ licensable, size = "sm" }: PlatformIconsProps) {
  const set = new Set(licensable);
  const badgeSize = size === "sm" ? "xs" : "sm";
  return (
    <ul className="flex items-center gap-1.5" aria-label="Disponibilidad por plataforma">
      {ALL_PLATFORMS.map((p) => {
        const allowed = set.has(p);
        const label = catalogStrings.filters.platform[p];
        const tip = interpolate(
          allowed ? catalogStrings.trackCard.licensableOn : catalogStrings.trackCard.notLicensableOn,
          { platform: label },
        );
        return (
          <li key={p}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span aria-label={tip} className="inline-flex">
                  <PlatformBadge
                    platform={p}
                    size={badgeSize}
                    className={cn(!allowed && "opacity-30")}
                  />
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">{tip}</TooltipContent>
            </Tooltip>
          </li>
        );
      })}
    </ul>
  );
}
