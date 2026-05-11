import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";

interface FeedPaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function FeedPagination({ page, totalPages, onChange }: FeedPaginationProps) {
  if (totalPages <= 1) return null;
  const t = trackingStrings.monitoring.pagination;

  return (
    <nav
      aria-label="Paginación del feed"
      className="flex items-center justify-center gap-3 pt-2"
    >
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        <ChevronLeft size={14} className="mr-1" aria-hidden="true" />
        {t.previous}
      </Button>
      <span className="text-xs text-muted-foreground">
        {t.pageOf.replace("{current}", String(page)).replace("{total}", String(totalPages))}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        {t.next}
        <ChevronRight size={14} className="ml-1" aria-hidden="true" />
      </Button>
    </nav>
  );
}
