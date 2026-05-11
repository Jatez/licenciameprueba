import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { packagesStrings } from "@/modules/packages/packages/strings";

interface Props {
  className?: string;
}

/**
 * Honest indicator that the receipt is a demo, not a fiscal DIAN invoice.
 * Visible from receipt downloads, detail page documents block and drawer.
 */
export function ProvisionalDocumentBadge({ className }: Props) {
  const s = packagesStrings.provisional;
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={`gap-1 cursor-help border-warning/50 text-foreground bg-warning-subtle/40 ${className ?? ""}`}
          >
            <FileText className="h-3 w-3" aria-hidden="true" />
            {s.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-xs">
          {s.tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
