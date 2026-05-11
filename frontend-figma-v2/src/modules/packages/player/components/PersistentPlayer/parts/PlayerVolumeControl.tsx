import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { usePlayer } from "../../../hooks/usePlayer";
import { getVolumeIcon } from "../../../utils/getVolumeIcon";
import { playerStrings } from "../../../strings";

interface PlayerVolumeControlProps {
  volume: number;
  isMuted: boolean;
}

export function PlayerVolumeControl({ volume, isMuted }: PlayerVolumeControlProps) {
  const { setVolume, toggleMute } = usePlayer();
  const [open, setOpen] = useState(false);
  const Icon = getVolumeIcon(volume, isMuted);
  const muteLabel = isMuted ? playerStrings.unmute : playerStrings.mute;
  const displayValue = isMuted ? 0 : volume;

  return (
    <div
      className="relative flex items-center gap-2"
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={muteLabel}
            aria-pressed={isMuted}
            onClick={toggleMute}
            className="h-9 w-9"
          >
            <Icon size={18} aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{muteLabel}</TooltipContent>
      </Tooltip>
      <div className={`w-24 transition-opacity ${open ? "opacity-100" : "opacity-100"}`}>
        <Slider
          value={[displayValue]}
          min={0}
          max={1}
          step={0.01}
          onValueChange={(v) => setVolume(v[0] ?? 0)}
          aria-label={playerStrings.volume}
          aria-valuetext={`${Math.round(displayValue * 100)}%`}
        />
      </div>
    </div>
  );
}
