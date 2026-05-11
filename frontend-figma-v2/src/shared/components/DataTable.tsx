import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "./Loader";
import { ErrorState } from "./ErrorState";
import { cn } from "@/lib/utils";
import { RowCard, type RowCardField } from "./ds/RowCard";

export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  /** Cell renderer. Receives the row and its index. */
  cell: (row: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface DataTablePaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export interface DataTableProps<T> {
  rows: T[];
  columns: DataTableColumn<T>[];
  rowKey: (row: T) => string;
  isLoading?: boolean;
  isFetching?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  emptyState?: ReactNode;
  pagination?: DataTablePaginationProps;
  className?: string;
  /**
   * Mobile rendering strategy:
   * - "cards": render as stacked `<RowCard />` below `md`. Requires `cardConfig`.
   * - "scroll": keep table, allow horizontal scroll.
   * - "auto" (default): "cards" if `cardConfig` is provided, else "scroll".
   */
  mobileView?: "cards" | "scroll" | "auto";
  cardConfig?: DataTableCardConfig<T>;
}

export interface DataTableCardConfig<T> {
  badge?: (row: T) => { text: ReactNode; variant?: "default" | "muted" };
  topRight?: (row: T) => ReactNode;
  cover?: (row: T) => ReactNode;
  title: (row: T) => ReactNode;
  subtitle?: (row: T) => ReactNode;
  fields?: (row: T) => RowCardField[];
  primaryAction?: (row: T) => { label: ReactNode; onClick: () => void };
  onClick?: (row: T) => void;
}

const SKELETON_ROWS = 6;

export function DataTable<T>({
  rows,
  columns,
  rowKey,
  isLoading,
  isFetching,
  error,
  onRetry,
  emptyState,
  pagination,
  className,
  mobileView = "auto",
  cardConfig,
}: DataTableProps<T>) {
  if (error) {
    return <ErrorState onRetry={onRetry} message={error.message} />;
  }

  const effectiveMobileView: "cards" | "scroll" =
    mobileView === "cards"
      ? "cards"
      : mobileView === "scroll"
        ? "scroll"
        : cardConfig
          ? "cards"
          : "scroll";
  const useMobileCards = effectiveMobileView === "cards" && cardConfig;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {useMobileCards && (
        <div
          className={cn(
            "flex flex-col gap-mobile-stack md:hidden",
            isFetching && "opacity-60",
          )}
        >
          {isLoading
            ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <Skeleton key={`m-skel-${i}`} className="h-28 w-full rounded-card" />
              ))
            : rows.length === 0
              ? emptyState
              : rows.map((row) => (
                  <RowCard
                    key={rowKey(row)}
                    badge={cardConfig!.badge?.(row)}
                    topRight={cardConfig!.topRight?.(row)}
                    cover={cardConfig!.cover?.(row)}
                    title={cardConfig!.title(row)}
                    subtitle={cardConfig!.subtitle?.(row)}
                    fields={cardConfig!.fields?.(row)}
                    primaryAction={cardConfig!.primaryAction?.(row)}
                    onClick={
                      cardConfig!.onClick ? () => cardConfig!.onClick!(row) : undefined
                    }
                  />
                ))}
        </div>
      )}
      <div
        className={cn(
          "relative overflow-hidden rounded-card border border-border",
          useMobileCards ? "hidden md:block" : "overflow-x-auto",
        )}
      >
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} className={col.headerClassName}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    {columns.map((col) => (
                      <TableCell key={col.key} className={col.className}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : rows.length === 0
                ? null
                : rows.map((row, index) => (
                    <TableRow key={rowKey(row)}>
                      {columns.map((col) => (
                        <TableCell key={col.key} className={col.className}>
                          {col.cell(row, index)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
          </TableBody>
        </Table>

        {!isLoading && rows.length === 0 && emptyState && (
          <div className="border-t border-border">{emptyState}</div>
        )}

        {isFetching && !isLoading && (
          <div className="absolute right-3 top-3">
            <Loader />
          </div>
        )}
      </div>

      {pagination && pagination.total > pagination.pageSize && (
        <DataTablePagination {...pagination} />
      )}
    </div>
  );
}

function DataTablePagination({
  page,
  pageSize,
  total,
  onPageChange,
}: DataTablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;
  return (
    <nav
      aria-label="Paginación"
      className="flex items-center justify-between text-xs text-foreground/70"
    >
      <span>
        Página <span className="font-tnum text-foreground">{page}</span> de{" "}
        <span className="font-tnum text-foreground">{totalPages}</span>
      </span>
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => canPrev && onPageChange(page - 1)}
          disabled={!canPrev}
          className="rounded-md border border-border px-3 py-1 disabled:opacity-40"
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={() => canNext && onPageChange(page + 1)}
          disabled={!canNext}
          className="rounded-md border border-border px-3 py-1 disabled:opacity-40"
        >
          Siguiente
        </button>
      </div>
    </nav>
  );
}