import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CreditPackage } from "@/api/types";
import { packagesStrings } from "@/modules/packages/packages/strings";
import { formatCop } from "@/modules/packages/packages/utils/formatCop";
import { formatCredits } from "@/modules/packages/packages/utils/formatCredits";

interface PackageComparisonTableProps {
  packages: CreditPackage[];
}

export function PackageComparisonTable({
  packages,
}: PackageComparisonTableProps) {
  const [open, setOpen] = useState(false);
  const s = packagesStrings.comparisonTable;
  return (
    <Card>
      <CardContent className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-between"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          <span className="font-medium">{s.title}</span>
          {open ? (
            <ChevronUp className="h-4 w-4" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>
        {open ? (
          <div className="mt-3 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{s.columns.package}</TableHead>
                  <TableHead className="text-right">{s.columns.credits}</TableHead>
                  <TableHead className="text-right">{s.columns.price}</TableHead>
                  <TableHead className="text-right">{s.columns.validity}</TableHead>
                  <TableHead className="text-right">{s.columns.pricePerCredit}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-right">{formatCredits(p.credits)}</TableCell>
                    <TableCell className="text-right">{formatCop(p.priceCop)}</TableCell>
                    <TableCell className="text-right">
                      {p.validityMonths} {s.monthsSuffix}
                    </TableCell>
                    <TableCell className="text-right">{formatCop(p.pricePerCreditCop)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
