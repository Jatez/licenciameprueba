import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SPOTIFY_STATUS_VARIANT } from "../mocks.spotify";
import { matchTracksStrings as s } from "../strings";
import type { SpotifyTrackResult } from "../types.spotify";
import { RowCard } from "@/shared/components/ds/RowCard";

interface SpotifyMatchResultsTableProps {
  rows: SpotifyTrackResult[];
  onAction?: (track: SpotifyTrackResult) => void;
}

const t = s.spotify.table;
const a = s.spotify.actions;

function actionLabel(track: SpotifyTrackResult): string {
  switch (track.status) {
    case "matched":
      return a.license;
    case "partial":
      return a.review;
    case "not_available":
      return a.findAlternative;
    case "removed":
      return a.viewDetail;
  }
}

export function SpotifyMatchResultsTable({ rows, onAction }: SpotifyMatchResultsTableProps) {
  return (
    <>
      {/* Mobile: stacked cards */}
      <div className="flex flex-col gap-mobile-stack md:hidden">
        {rows.map((track) => (
          <RowCard
            key={track.id}
            badge={{
              text: s.spotify.statusLabel[track.status],
              variant: "muted",
            }}
            title={track.spotifyTitle}
            subtitle={`${track.artist} · ${track.album}`}
            fields={[
              {
                label: t.confidence,
                value: track.confidence == null ? "N/A" : `${track.confidence}%`,
              },
              {
                label: t.credits,
                value: track.credits != null ? `${track.credits}` : t.empty,
              },
            ]}
            primaryAction={
              onAction && track.status !== "removed"
                ? { label: actionLabel(track), onClick: () => onAction(track) }
                : undefined
            }
          />
        ))}
      </div>

      {/* Desktop: table */}
      <Card className="hidden overflow-hidden p-0 md:block">
        <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.track}</TableHead>
              <TableHead>{t.artist}</TableHead>
              <TableHead>{t.album}</TableHead>
              <TableHead>{t.status}</TableHead>
              <TableHead>{t.confidence}</TableHead>
              <TableHead>{t.catalog}</TableHead>
              <TableHead className="text-right">{t.credits}</TableHead>
              <TableHead className="text-right">{t.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((track) => (
              <TableRow key={track.id}>
                <TableCell className="font-medium text-foreground">{track.spotifyTitle}</TableCell>
                <TableCell className="text-muted-foreground">{track.artist}</TableCell>
                <TableCell className="text-muted-foreground">{track.album}</TableCell>
                <TableCell>
                  <Badge variant={SPOTIFY_STATUS_VARIANT[track.status]}>
                    {s.spotify.statusLabel[track.status]}
                  </Badge>
                </TableCell>
                <TableCell className="tabular-nums text-foreground">
                  {track.confidence == null ? "N/A" : `${track.confidence}%`}
                </TableCell>
                <TableCell className="text-foreground">
                  {track.catalogTitle ?? t.empty}
                </TableCell>
                <TableCell className="text-right tabular-nums text-foreground">
                  {track.credits != null ? `${track.credits}` : t.empty}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant={track.status === "matched" ? "default" : "outline"}
                    onClick={() => onAction?.(track)}
                    disabled={track.status === "removed"}
                  >
                    {actionLabel(track)}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </Card>
    </>
  );
}
