import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { usePlayer } from "../../../hooks/usePlayer";
import { useIsMobile } from "@/hooks/use-mobile";
import { playerStrings } from "../../../strings";
import type { TrackSummary } from "@/api/types";

interface PlayerActionsProps {
  track: TrackSummary;
  isExpanded?: boolean;
}

export function PlayerActions({ track }: PlayerActionsProps) {
  const { close } = usePlayer();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const onLicense = () => navigate(`/licensing/new?trackId=${track.id}`);

  return (
    <div className="flex items-center justify-end gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          {isMobile ? (
            <Button
              type="button"
              variant="default"
              size="icon"
              aria-label={playerStrings.license}
              onClick={onLicense}
              className="h-10 w-10"
            >
              <span className="text-xs font-bold">€</span>
            </Button>
          ) : (
            <Button type="button" variant="default" size="default" onClick={onLicense}>
              {playerStrings.license}
            </Button>
          )}
        </TooltipTrigger>
        <TooltipContent>{playerStrings.license}</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={playerStrings.close}
            onClick={close}
            className="h-9 w-9"
          >
            <X size={16} aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{playerStrings.close}</TooltipContent>
      </Tooltip>
    </div>
  );
}
