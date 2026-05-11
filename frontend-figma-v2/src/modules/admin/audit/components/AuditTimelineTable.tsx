import { ShieldAlert, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuditSeverityBadge } from "./AuditSeverityBadge";
import { auditStrings } from "../strings";
import type { AuditEvent } from "../types";

interface Props {
  events: AuditEvent[];
  onSelect: (event: AuditEvent) => void;
}

function formatTimestamp(iso: string) {
  try {
    return new Intl.DateTimeFormat("es-CO", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function AuditTimelineTable({ events, onSelect }: Props) {
  const t = auditStrings.table;

  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/40 px-6 py-16 text-center text-sm text-muted-foreground">
        {t.empty}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">{t.headers.timestamp}</TableHead>
            <TableHead>{t.headers.severity}</TableHead>
            <TableHead>{t.headers.action}</TableHead>
            <TableHead>{t.headers.actor}</TableHead>
            <TableHead>{t.headers.resource}</TableHead>
            <TableHead className="whitespace-nowrap">{t.headers.ip}</TableHead>
            <TableHead className="text-right">{t.headers.detail}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((e) => (
            <TableRow
              key={e.id}
              className="cursor-pointer hover:bg-muted/40"
              onClick={() => onSelect(e)}
            >
              <TableCell className="font-tnum text-xs text-muted-foreground whitespace-nowrap">
                {formatTimestamp(e.timestamp)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <AuditSeverityBadge severity={e.severity} />
                  {e.isCritical && (
                    <ShieldAlert className="h-3.5 w-3.5 text-error" aria-label="Crítica" />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-0.5">
                  <p className="text-sm text-foreground">{e.action}</p>
                  <Badge variant="secondary" className="text-[10px]">
                    {auditStrings.module[e.module]}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-0.5">
                  <p className="text-sm text-foreground">{e.actorName}</p>
                  <p className="text-xs text-muted-foreground">
                    {auditStrings.actorType[e.actorType]}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-0.5">
                  <p className="text-sm text-foreground">{e.resourceLabel}</p>
                  <p className="text-xs text-muted-foreground font-tnum">{e.resourceId}</p>
                </div>
              </TableCell>
              <TableCell className="font-tnum text-xs text-muted-foreground">{e.ip}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    onSelect(e);
                  }}
                  aria-label={t.rowAriaLabel}
                >
                  <Eye className="h-4 w-4" aria-hidden="true" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
