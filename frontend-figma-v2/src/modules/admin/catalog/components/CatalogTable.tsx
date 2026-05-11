import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrackStatusBadge } from "./TrackStatusBadge";
import { TrackRowActions } from "./TrackRowActions";
import { catalogStrings } from "../strings";
import type { AdminTrack } from "../types";

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("es-CO", { day: "2-digit", month: "short", year: "numeric" }).format(
      new Date(iso),
    );
  } catch {
    return iso;
  }
}

interface CatalogTableProps {
  tracks: AdminTrack[];
  onViewDetail: (t: AdminTrack) => void;
  onEdit: (t: AdminTrack) => void;
  onHide: (t: AdminTrack) => void;
  onRestore: (t: AdminTrack) => void;
}

export function CatalogTable({ tracks, onViewDetail, onEdit, onHide, onRestore }: CatalogTableProps) {
  const t = catalogStrings.table;

  if (tracks.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <p className="text-base font-semibold text-foreground">{t.emptyTitle}</p>
          <p className="text-sm text-muted-foreground max-w-sm">{t.emptyDescription}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t.track}</TableHead>
            <TableHead className="hidden md:table-cell">{t.artist}</TableHead>
            <TableHead className="hidden lg:table-cell">{t.genre}</TableHead>
            <TableHead className="hidden xl:table-cell">{t.mood}</TableHead>
            <TableHead className="hidden md:table-cell text-right">{t.duration}</TableHead>
            <TableHead className="hidden lg:table-cell text-right">{t.credits}</TableHead>
            <TableHead>{t.status}</TableHead>
            <TableHead className="text-right">{t.activeLicenses}</TableHead>
            <TableHead className="hidden lg:table-cell">{t.updatedAt}</TableHead>
            <TableHead className="text-right">{t.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tracks.map((track) => (
            <TableRow key={track.id} className="cursor-pointer" onClick={() => onViewDetail(track)}>
              <TableCell className="font-medium text-foreground">
                <div className="flex flex-col gap-1">
                  <span className="leading-tight">{track.title}</span>
                  <span className="text-xs text-muted-foreground md:hidden">{track.artist}</span>
                  {!track.hasCompleteMetadata && (
                    <Badge variant="pendiente" className="w-fit">
                      <AlertTriangle className="mr-1 h-3 w-3" aria-hidden="true" />
                      {t.metadataIncomplete}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell text-foreground">{track.artist}</TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground">{track.genre}</TableCell>
              <TableCell className="hidden xl:table-cell text-muted-foreground">{track.mood}</TableCell>
              <TableCell className="hidden md:table-cell text-right font-tnum">
                {formatDuration(track.durationSeconds)}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-right font-tnum">
                {track.creditsRequired}
              </TableCell>
              <TableCell>
                <TrackStatusBadge status={track.status} />
              </TableCell>
              <TableCell className="text-right font-tnum text-foreground">
                {track.activeLicenses.toLocaleString("es-CO")}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground">
                {formatDate(track.updatedAt)}
              </TableCell>
              <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                <TrackRowActions
                  track={track}
                  onViewDetail={onViewDetail}
                  onEdit={onEdit}
                  onHide={onHide}
                  onRestore={onRestore}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
