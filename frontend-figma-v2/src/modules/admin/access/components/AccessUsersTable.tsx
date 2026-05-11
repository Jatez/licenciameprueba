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
import { ShieldCheck, ShieldOff } from "lucide-react";
import { AccessUserStatusBadge } from "./AccessStatusBadge";
import { AccessUserRowActions } from "./AccessUserRowActions";
import { accessStrings } from "../strings";
import type { AccessUser } from "../types";

interface Props {
  rows: AccessUser[];
  showCompany?: boolean;
  onChangeRole: (u: AccessUser) => void;
  onSuspend: (u: AccessUser) => void;
  onReactivate: (u: AccessUser) => void;
  onResetMfa: (u: AccessUser) => void;
}

const fmtDate = (iso: string | null) => {
  if (!iso) return "—";
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

export function AccessUsersTable({
  rows,
  showCompany = true,
  onChangeRole,
  onSuspend,
  onReactivate,
  onResetMfa,
}: Props) {
  const t = accessStrings.table;
  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t.headers.user}</TableHead>
            {showCompany && <TableHead>{t.headers.company}</TableHead>}
            <TableHead>{t.headers.role}</TableHead>
            <TableHead>{t.headers.mfa}</TableHead>
            <TableHead>{t.headers.status}</TableHead>
            <TableHead>{t.headers.lastSignIn}</TableHead>
            <TableHead className="w-[60px] text-right">{t.headers.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={showCompany ? 7 : 6}
                className="py-12 text-center text-sm text-muted-foreground"
              >
                {t.empty}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{u.fullName}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                </TableCell>
                {showCompany && (
                  <TableCell>
                    <span className="text-sm text-foreground">{u.company}</span>
                  </TableCell>
                )}
                <TableCell>
                  <Badge variant="info">{accessStrings.roles[u.role]}</Badge>
                </TableCell>
                <TableCell>
                  {u.mfaEnabled ? (
                    <span className="inline-flex items-center gap-1 text-xs text-success">
                      <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                      Activa
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-warning">
                      <ShieldOff className="h-3.5 w-3.5" aria-hidden="true" />
                      Pendiente
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <AccessUserStatusBadge status={u.status} />
                </TableCell>
                <TableCell className="text-xs text-muted-foreground font-tnum">
                  {fmtDate(u.lastSignInAt)}
                </TableCell>
                <TableCell className="text-right">
                  <AccessUserRowActions
                    user={u}
                    onChangeRole={onChangeRole}
                    onSuspend={onSuspend}
                    onReactivate={onReactivate}
                    onResetMfa={onResetMfa}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
