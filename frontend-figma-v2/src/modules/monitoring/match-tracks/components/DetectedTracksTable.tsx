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
import { matchTracksStrings as s } from "../strings";
import type {
  SocialDetection,
  SocialLicenseStatus,
  SocialMatchStatus,
} from "../types.social";
import { MatchSourceBadge } from "./MatchSourceBadge";
import { RowCard } from "@/shared/components/ds/RowCard";

const MATCH_VARIANT: Record<
  SocialMatchStatus,
  "vigente" | "pendiente" | "expirada" | "info"
> = {
  matched: "vigente",
  partial: "pendiente",
  not_available: "expirada",
  legal_review: "info",
};

const LICENSE_VARIANT: Record<
  SocialLicenseStatus,
  "vigente" | "pendiente" | "expirada" | "secondary"
> = {
  licensed: "vigente",
  pending_review: "pendiente",
  potential_risk: "expirada",
  not_licensed: "secondary",
};

interface DetectedTracksTableProps {
  rows: SocialDetection[];
  onAction?: (row: SocialDetection) => void;
}

function actionLabel(row: SocialDetection) {
  if (row.licenseStatus === "licensed") return s.social.actions.viewLicense;
  if (row.matchStatus === "matched") return s.social.actions.license;
  if (row.matchStatus === "not_available") return s.social.actions.findAlternative;
  return s.social.actions.review;
}

export function DetectedTracksTable({ rows, onAction }: DetectedTracksTableProps) {
  const t = s.social.detectionsTable;
  return (
    <>
      {/* Mobile: stacked cards */}
      <div className="flex flex-col gap-mobile-stack md:hidden">
        {rows.map((row) => (
          <RowCard
            key={row.id}
            badge={{
              text: s.social.matchStatus[row.matchStatus],
              variant: "muted",
            }}
            topRight={<MatchSourceBadge source={row.platform} />}
            title={row.trackTitle}
            subtitle={`${row.artist} · ${row.postLabel}`}
            fields={[
              {
                label: t.confidence,
                value: `${row.confidence > 0 ? row.confidence : 0}%`,
              },
              {
                label: t.licenseStatus,
                value: (
                  <Badge variant={LICENSE_VARIANT[row.licenseStatus]}>
                    {s.social.licenseStatus[row.licenseStatus]}
                  </Badge>
                ),
              },
            ]}
            primaryAction={
              onAction
                ? { label: actionLabel(row), onClick: () => onAction(row) }
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
              <TableHead>{t.post}</TableHead>
              <TableHead>{t.platform}</TableHead>
              <TableHead>{t.track}</TableHead>
              <TableHead>{t.artist}</TableHead>
              <TableHead>{t.matchStatus}</TableHead>
              <TableHead>{t.confidence}</TableHead>
              <TableHead>{t.licenseStatus}</TableHead>
              <TableHead className="text-right">{t.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium text-foreground">{row.postLabel}</TableCell>
                <TableCell>
                  <MatchSourceBadge source={row.platform} />
                </TableCell>
                <TableCell className="text-foreground">{row.trackTitle}</TableCell>
                <TableCell className="text-muted-foreground">{row.artist}</TableCell>
                <TableCell>
                  <Badge variant={MATCH_VARIANT[row.matchStatus]}>
                    {s.social.matchStatus[row.matchStatus]}
                  </Badge>
                </TableCell>
                <TableCell className="tabular-nums text-foreground">
                  {row.confidence > 0 ? `${row.confidence}%` : "0%"}
                </TableCell>
                <TableCell>
                  <Badge variant={LICENSE_VARIANT[row.licenseStatus]}>
                    {s.social.licenseStatus[row.licenseStatus]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant={row.matchStatus === "matched" ? "default" : "outline"}
                    onClick={() => onAction?.(row)}
                  >
                    {actionLabel(row)}
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
