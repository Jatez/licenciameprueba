import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { usePlayer } from "../../../hooks/usePlayer";
import { PREVIEW_DURATION_SEC } from "@/shared/audio";
import { formatTime } from "../../../utils/formatTime";
import { playerStrings } from "../../../strings";

interface PlayerControlsProps {
  isPlaying: boolean;
  currentTimeSec: number;
}

export function PlayerControls({ isPlaying, currentTimeSec }: PlayerControlsProps) {
  const { togglePlay } = usePlayer();
  const label = isPlaying ? playerStrings.pause : playerStrings.play;
  const Icon = isPlaying ? Pause : Play;

  return (
    <div className="flex items-center justify-center gap-3">
      <span className="hidden md:inline tabular-nums text-xs text-lm-gray-500 w-9 text-right">
        {formatTime(currentTimeSec)}
      </span>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant="default"
            aria-pressed={isPlaying}
            aria-label={label}
            onClick={togglePlay}
            className="h-11 w-11"
          >
            <Icon size={20} className="ml-0.5" aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
      <span className="hidden md:inline tabular-nums text-xs text-lm-gray-500 w-9">
        {formatTime(PREVIEW_DURATION_SEC)}
      </span>
    </div>
  );
}
