import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { catalogStrings } from "@/modules/tracks/strings";
import { interpolate, isTypingTarget } from "@/modules/tracks/utils";
import { buildPaginationRange } from "./paginationRange";

interface CatalogPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (next: number) => void;
}

export function CatalogPagination({ page, totalPages, onPageChange }: CatalogPaginationProps) {
  // Keyboard arrows for paging — outside of inputs.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      if (e.key === "ArrowLeft" && page > 1) onPageChange(page - 1);
      else if (e.key === "ArrowRight" && page < totalPages) onPageChange(page + 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [page, totalPages, onPageChange]);

  if (totalPages <= 1) return null;
  const range = buildPaginationRange(page, totalPages);
  const goTo = (p: number) => () => onPageChange(p);

  return (
    <Pagination aria-label={catalogStrings.pagination.label}>
      <PaginationContent className="flex-wrap">
        <PaginationItem>
          <PaginationLink
            href="#"
            size="default"
            aria-label={catalogStrings.pagination.prev}
            aria-disabled={page === 1}
            className={cn("gap-1 pl-2.5", page === 1 && "pointer-events-none opacity-50")}
            onClick={(e) => {
              e.preventDefault();
              if (page > 1) onPageChange(page - 1);
            }}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{catalogStrings.pagination.prev}</span>
          </PaginationLink>
        </PaginationItem>

        <li className="hidden items-center px-2 text-xs text-muted-foreground sm:flex md:hidden">
          {interpolate(catalogStrings.pagination.compact, { page, total: totalPages })}
        </li>

        {range.map((entry, idx) =>
          entry === "…" ? (
            <PaginationItem key={`e-${idx}`} className="hidden md:list-item">
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={entry} className="hidden md:list-item">
              <PaginationLink
                href="#"
                isActive={entry === page}
                aria-label={interpolate(catalogStrings.pagination.goToPage, { page: entry })}
                onClick={(e) => {
                  e.preventDefault();
                  goTo(entry as number)();
                }}
              >
                {entry}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationLink
            href="#"
            size="default"
            aria-label={catalogStrings.pagination.next}
            aria-disabled={page === totalPages}
            className={cn(
              "gap-1 pr-2.5",
              page === totalPages && "pointer-events-none opacity-50",
            )}
            onClick={(e) => {
              e.preventDefault();
              if (page < totalPages) onPageChange(page + 1);
            }}
          >
            <span className="hidden sm:inline">{catalogStrings.pagination.next}</span>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
