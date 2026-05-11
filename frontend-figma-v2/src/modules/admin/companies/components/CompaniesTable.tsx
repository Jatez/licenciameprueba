import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CompanyStatusBadge } from "./CompanyStatusBadge";
import { CompanyRowActions } from "./CompanyRowActions";
import { companiesStrings } from "../strings";
import type { AdminCompany } from "../types";

interface Props {
  rows: AdminCompany[];
  onView: (c: AdminCompany) => void;
  onAssignPlan: (c: AdminCompany) => void;
  onSuspend: (c: AdminCompany) => void;
  onReactivate: (c: AdminCompany) => void;
}

export function CompaniesTable({ rows, onView, onAssignPlan, onSuspend, onReactivate }: Props) {
  const t = companiesStrings.table;
  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t.headers.name}</TableHead>
            <TableHead>{t.headers.plan}</TableHead>
            <TableHead className="text-right">{t.headers.credits}</TableHead>
            <TableHead className="text-right">{t.headers.licenses}</TableHead>
            <TableHead>{t.headers.status}</TableHead>
            <TableHead className="w-[60px] text-right">{t.headers.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                {t.empty}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((c) => (
              <TableRow
                key={c.id}
                className="cursor-pointer"
                onClick={() => onView(c)}
              >
                <TableCell>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.taxId} · {c.city}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-foreground">{c.planLabel}</span>
                </TableCell>
                <TableCell className="text-right font-tnum text-sm text-foreground">
                  {c.wallet.creditsAvailable.toLocaleString("es-CO")}
                  <span className="ml-1 text-xs text-muted-foreground">
                    / {c.wallet.creditsTotal.toLocaleString("es-CO")}
                  </span>
                </TableCell>
                <TableCell className="text-right font-tnum text-sm text-foreground">
                  {c.activeLicenses}
                </TableCell>
                <TableCell>
                  <CompanyStatusBadge status={c.status} />
                </TableCell>
                <TableCell
                  className="text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CompanyRowActions
                    company={c}
                    onView={onView}
                    onAssignPlan={onAssignPlan}
                    onSuspend={onSuspend}
                    onReactivate={onReactivate}
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
