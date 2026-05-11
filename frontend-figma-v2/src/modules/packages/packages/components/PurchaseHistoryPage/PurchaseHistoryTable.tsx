import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Purchase } from "@/api/types";
import { packagesStrings } from "@/modules/packages/packages/strings";
import { formatCop } from "@/modules/packages/packages/utils/formatCop";
import { formatCredits } from "@/modules/packages/packages/utils/formatCredits";
import { formatDate } from "@/modules/packages/packages/utils/formatDate";
import { downloadReceiptPdf } from "@/modules/packages/packages/utils/generateReceiptPdf";
import { PurchaseStatusBadge } from "./PurchaseStatusBadge";
import { PurchaseHistoryCardMobile } from "./PurchaseHistoryCardMobile";

interface Props {
  purchases: Purchase[];
  onQuickView: (purchase: Purchase) => void;
}

export function PurchaseHistoryTable({ purchases, onQuickView }: Props) {
  const s = packagesStrings.history;

  const handleDownload = (p: Purchase) => {
    downloadReceiptPdf(p);
    toast.success(s.receiptDownloadedToast);
  };

  return (
    <>
      {/* Mobile: stacked cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {purchases.map((p) => (
          <PurchaseHistoryCardMobile key={p.id} purchase={p} onQuickView={onQuickView} />
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border">
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{s.columns.date}</TableHead>
            <TableHead>{s.columns.package}</TableHead>
            <TableHead className="text-right">{s.columns.creditsCredited}</TableHead>
            <TableHead>{s.columns.method}</TableHead>
            <TableHead>{s.columns.status}</TableHead>
            <TableHead className="text-right">{s.columns.total}</TableHead>
            <TableHead className="text-right">{s.columns.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.map((p) => {
            const isPending = p.creditsCredited === 0 && p.status !== "rejected" && p.status !== "failed";
            return (
              <TableRow key={p.id}>
                <TableCell className="whitespace-nowrap text-sm">
                  {formatDate(p.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{p.packageSnapshot.name}</span>
                    <span className="text-xs text-muted-foreground">{p.id}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <TooltipProvider delayDuration={150}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          className={`tabular-nums ${isPending ? "text-muted-foreground" : "text-foreground"}`}
                        >
                          {formatCredits(p.creditsCredited)}
                          <span className="text-xs text-muted-foreground">
                            {" "}/ {formatCredits(p.packageSnapshot.credits)}
                          </span>
                        </span>
                      </TooltipTrigger>
                      {isPending ? (
                        <TooltipContent side="top" className="max-w-xs text-xs">
                          {s.creditsHeld}
                        </TooltipContent>
                      ) : null}
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="text-sm">{s.methods[p.paymentMethod]}</TableCell>
                <TableCell>
                  <PurchaseStatusBadge status={p.status} />
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCop(p.totalCop)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label={`${s.quickView} ${p.id}`}
                      onClick={() => onQuickView(p)}
                    >
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    {p.status === "confirmed" ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        aria-label={`${s.downloadReceipt} ${p.id}`}
                        onClick={() => handleDownload(p)}
                      >
                        <Download className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    ) : null}
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/packages/history/${p.id}`}>{s.viewDetail}</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      </div>
    </>
  );
}
