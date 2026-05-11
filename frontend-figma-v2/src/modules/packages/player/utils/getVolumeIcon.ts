import { Volume1, Volume2, VolumeX, type LucideIcon } from "lucide-react";

/** Pick a volume icon based on level + mute state. */
export function getVolumeIcon(volume: number, isMuted: boolean): LucideIcon {
  if (isMuted || volume <= 0) return VolumeX;
  if (volume > 0.66) return Volume2;
  return Volume1;
}
