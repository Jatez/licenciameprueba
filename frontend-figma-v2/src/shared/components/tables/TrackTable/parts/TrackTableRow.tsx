import { Play, Mic, Download, Star, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Waveform } from "@/shared/components/Waveform";
import type { TrackTableRowProps } from "../TrackTable.types";

/**
 * TrackTableRow — single track row.
 * - Height ~68px (py-3 + content)
 * - Hover: bg-lm-gray-50
 * - Last row in table has no bottom border
 */
export function TrackTableRow({
  track,
  onLicense,
  onPlay,
  onDownload,
  onFavorite,
  onMore,
}: TrackTableRowProps) {
  const { cover, title, artist, bpm, duration } = track;

  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-lm-gray-200 last:border-b-0 hover:bg-lm-gray-50 transition-colors">
      <img
        src={cover}
        alt={title}
        className="w-11 h-11 rounded-md object-cover bg-lm-gray-200 flex-shrink-0"
      />

      <button
        type="button"
        aria-label={`Reproducir ${title}`}
        onClick={() => onPlay?.(track)}
        className="text-lm-gray-400 hover:text-lm-gray-700 flex-shrink-0"
      >
        <Play size={16} />
      </button>

      <div className="min-w-[140px] flex-1">
        <p className="text-sm font-medium text-lm-gray-900 truncate">{title}</p>
        <p className="text-sm text-muted-foreground truncate">{artist}</p>
      </div>

      <span className="text-sm text-lm-gray-700 w-12 text-center flex-shrink-0">{bpm}</span>

      <div className="flex items-center gap-1 text-muted-foreground flex-shrink-0">
        <Mic size={14} />
        <span className="text-sm">{duration}</span>
      </div>

      <div className="hidden lg:block flex-shrink-0">
        <Waveform bars={30} />
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          type="button"
          aria-label="Descargar"
          onClick={() => onDownload?.(track)}
          className="text-lm-gray-400 hover:text-lm-gray-700"
        >
          <Download size={16} />
        </button>
        <button
          type="button"
          aria-label="Favorito"
          onClick={() => onFavorite?.(track)}
          className="text-lm-gray-400 hover:text-lm-gray-700"
        >
          <Star size={16} />
        </button>
        <button
          type="button"
          aria-label="Más opciones"
          onClick={() => onMore?.(track)}
          className="text-lm-gray-400 hover:text-lm-gray-700"
        >
          <MoreVertical size={16} />
        </button>
      </div>

      <Button size="sm" className="flex-shrink-0" onClick={() => onLicense?.(track)}>
        Licenciar
      </Button>
    </div>
  );
}
