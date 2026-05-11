import { MoreHorizontal, Eye, Pencil, EyeOff, RotateCcw, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { catalogStrings } from "../strings";
import type { AdminTrack } from "../types";

interface TrackRowActionsProps {
  track: AdminTrack;
  onViewDetail: (t: AdminTrack) => void;
  onEdit: (t: AdminTrack) => void;
  onHide: (t: AdminTrack) => void;
  onRestore: (t: AdminTrack) => void;
}

export function TrackRowActions({
  track,
  onViewDetail,
  onEdit,
  onHide,
  onRestore,
}: TrackRowActionsProps) {
  const t = catalogStrings.rowActions;
  const isHidden = track.status === "hidden";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Acciones del track">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onSelect={() => onViewDetail(track)}>
          <Eye className="mr-2 h-4 w-4" aria-hidden="true" />
          {t.viewDetail}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onEdit(track)}>
          <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
          {t.editMetadata}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onViewDetail(track)}>
          <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
          {t.viewLicenses}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {isHidden ? (
          <DropdownMenuItem onSelect={() => onRestore(track)}>
            <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
            {t.restore}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onSelect={() => onHide(track)}>
            <EyeOff className="mr-2 h-4 w-4" aria-hidden="true" />
            {t.hide}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
