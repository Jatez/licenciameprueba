import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Send, X } from "lucide-react";
import { InvitationStatusBadge } from "./AccessStatusBadge";
import { accessStrings } from "../strings";
import type { PendingInvitation } from "../types";

interface Props {
  rows: PendingInvitation[];
  onResend: (id: string) => void;
  onRevoke: (id: string) => void;
}

const fmtDate = (iso: string) => {
  try {
    return new Intl.DateTimeFormat("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
};

export function AccessInvitationsTable({ rows, onResend, onRevoke }: Props) {
  const t = accessStrings.table.invitations;
  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t.headers.recipient}</TableHead>
            <TableHead>{t.headers.company}</TableHead>
            <TableHead>{t.headers.role}</TableHead>
            <TableHead>{t.headers.invitedAt}</TableHead>
            <TableHead>{t.headers.expiresAt}</TableHead>
            <TableHead>{t.headers.status}</TableHead>
            <TableHead className="text-right">{t.headers.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                {t.empty}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((i) => (
              <TableRow key={i.id}>
                <TableCell>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{i.fullName}</p>
                    <p className="text-xs text-muted-foreground">{i.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-foreground">{i.company}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="info">{accessStrings.roles[i.role]}</Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground font-tnum">
                  {fmtDate(i.invitedAt)}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground font-tnum">
                  {fmtDate(i.expiresAt)}
                </TableCell>
                <TableCell>
                  <InvitationStatusBadge status={i.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onResend(i.id)}
                      aria-label={accessStrings.rowActions.resend}
                    >
                      <Send className="h-4 w-4" aria-hidden="true" />
                      {accessStrings.rowActions.resend}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRevoke(i.id)}
                      aria-label={accessStrings.rowActions.revoke}
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
