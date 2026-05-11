import { Eye, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BillingStatusBadge } from "./BillingStatusBadge";
import { billingStrings } from "../strings";
import { formatCop } from "../mocks";
import type { AdminPayment } from "../types";

interface Props {
  payments: AdminPayment[];
  onSelect: (p: AdminPayment) => void;
  onViewInvoice: (p: AdminPayment) => void;
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function BillingTable({ payments, onSelect, onViewInvoice }: Props) {
  const t = billingStrings.table;

  if (payments.length === 0) {
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
            <TableHead>{t.headers.invoice}</TableHead>
            <TableHead>{t.headers.company}</TableHead>
            <TableHead>{t.headers.package}</TableHead>
            <TableHead className="text-right">{t.headers.amount}</TableHead>
            <TableHead>{t.headers.method}</TableHead>
            <TableHead>{t.headers.status}</TableHead>
            <TableHead className="whitespace-nowrap">{t.headers.date}</TableHead>
            <TableHead className="text-right">{t.headers.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((p) => (
            <TableRow
              key={p.id}
              className="cursor-pointer hover:bg-muted/40"
              onClick={() => onSelect(p)}
            >
              <TableCell className="font-tnum text-xs text-foreground">{p.invoiceNumber}</TableCell>
              <TableCell className="text-sm text-foreground">{p.companyName}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{p.packageName}</TableCell>
              <TableCell className="text-right font-tnum text-sm">
                {formatCop(p.amountTotalCop)}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {billingStrings.method[p.method]}
              </TableCell>
              <TableCell>
                <BillingStatusBadge status={p.status} />
              </TableCell>
              <TableCell className="font-tnum text-xs text-muted-foreground">
                {formatDate(p.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewInvoice(p);
                    }}
                    aria-label={t.viewInvoice}
                  >
                    <FileText className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(p);
                    }}
                    aria-label={t.viewDetail}
                  >
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
