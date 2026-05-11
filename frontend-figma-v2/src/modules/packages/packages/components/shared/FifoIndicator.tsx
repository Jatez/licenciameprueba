import { ArrowDownToLine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { packagesStrings } from "@/modules/packages/packages/strings";

export function FifoIndicator() {
  return (
    <Badge variant="metric" className="gap-1">
      <ArrowDownToLine className="h-3 w-3" aria-hidden="true" />
      {packagesStrings.fifo.chip}
    </Badge>
  );
}
