/**
 * F-11 · Local pagination control for the publications table.
 * Mirrors the catalog pattern but is self-contained (no catalog strings dep).
 */
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

function buildRange(current: number, total: number): Array<number | "…"> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const range: Array<number | "…"> = [1];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);
  if (left > 2) range.push("…");
  for (let i = left; i <= right; i++) range.push(i);
  if (right < total - 1) range.push("…");
  range.push(total);
  return range;
}

interface TablePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (next: number) => void;
}

export function TablePagination({ page, totalPages, onPageChange }: TablePaginationProps) {
  if (totalPages <= 1) return null;
  const range = buildRange(page, totalPages);

  return (
    <Pagination aria-label="Paginación de publicaciones" className="mx-0 w-auto justify-end">
      <PaginationContent className="flex-wrap">
        <PaginationItem>
          <PaginationLink
            href="#"
            size="default"
            aria-label="Anterior"
            aria-disabled={page === 1}
            className={cn("gap-1 px-3", page === 1 && "pointer-events-none opacity-50")}
            onClick={(e) => {
              e.preventDefault();
              if (page > 1) onPageChange(page - 1);
            }}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Anterior</span>
          </PaginationLink>
        </PaginationItem>

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
                aria-label={`Ir a página ${entry}`}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(entry as number);
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
            aria-label="Siguiente"
            aria-disabled={page === totalPages}
            className={cn("gap-1 px-3", page === totalPages && "pointer-events-none opacity-50")}
            onClick={(e) => {
              e.preventDefault();
              if (page < totalPages) onPageChange(page + 1);
            }}
          >
            <span className="hidden sm:inline">Siguiente</span>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
