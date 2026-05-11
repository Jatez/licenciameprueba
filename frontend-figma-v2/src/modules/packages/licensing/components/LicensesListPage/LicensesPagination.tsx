import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LicenseListPageSize } from "@/api/types";
import { formatString, licensingStrings } from "@/modules/packages/licensing/strings";

interface Props {
  page: number;
  totalPages: number;
  pageSize: LicenseListPageSize;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: LicenseListPageSize) => void;
}

const PAGE_SIZES: LicenseListPageSize[] = [25, 50, 100];

export function LicensesPagination({
  page,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: Props) {
  const t = licensingStrings.list.pagination;
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <div className="text-sm text-muted-foreground">
        {formatString(t.page, { current: page, total: totalPages })}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={!canPrev}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          {t.previous}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={!canNext}
        >
          {t.next}
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Select
          value={String(pageSize)}
          onValueChange={(v) => onPageSizeChange(Number(v) as LicenseListPageSize)}
        >
          <SelectTrigger className="w-[120px]" aria-label="Items por página">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZES.map((s) => (
              <SelectItem key={s} value={String(s)}>
                {formatString(t.perPage, { size: s })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
