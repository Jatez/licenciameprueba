/**
 * F-11 · Publications table.
 *
 * Desktop: <Table> with sortable headers, inline search, column toggle,
 * pagination, page-size selector. Mobile: stacked cards.
 *
 * Receives the already-filtered server slice via React Query-like hook;
 * applies in-memory text search + sort on top of it before paginating.
 */
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowDown, ArrowUp, ArrowUpDown, Columns3, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { metricsStrings } from "../strings";
import { interpolateString } from "../utils";
import { sortPublications, type PublicationSortKey, type SortDirection } from "../selectors/sortPublications";
import { searchPublications } from "../selectors/searchPublications";
import { publicationDetailPath } from "../routes";
import { PublicationRow, type PublicationColumnKey } from "./PublicationRow";
import { PublicationCardMobile } from "./PublicationCardMobile";
import { TablePagination } from "./TablePagination";
import type { PublicationMetric } from "../types";

interface PublicationsTableProps {
  publications: PublicationMetric[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  isLoading: boolean;
  /** Subtle overlay during refetches (not the initial skeleton). */
  isFetching: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  /** Empty-state controls (only shown when there are zero rows). */
  emptyAction?: React.ReactNode;
}

const PAGE_SIZES = [20, 50, 100];

const ALL_COLUMNS: { key: PublicationColumnKey; label: string; sortKey?: PublicationSortKey; numeric?: boolean }[] = [
  { key: "preview", label: metricsStrings.table.columns.preview },
  { key: "track", label: metricsStrings.table.columns.track },
  { key: "platform", label: metricsStrings.table.columns.platform, sortKey: "platform" },
  { key: "date", label: metricsStrings.table.columns.date, sortKey: "publishedAt" },
  { key: "useType", label: metricsStrings.table.columns.useType, sortKey: "useType" },
  { key: "views", label: metricsStrings.table.columns.views, sortKey: "views", numeric: true },
  { key: "interactions", label: metricsStrings.table.columns.interactions, sortKey: "interactions", numeric: true },
  { key: "engagement", label: metricsStrings.table.columns.engagement, sortKey: "engagement", numeric: true },
  { key: "status", label: metricsStrings.table.columns.status, sortKey: "status" },
  { key: "actions", label: metricsStrings.table.columns.actions },
];

const DEFAULT_VISIBLE: PublicationColumnKey[] = [
  "preview", "track", "platform", "date", "useType", "views", "interactions", "engagement", "status", "actions",
];

export function PublicationsTable({
  publications,
  total,
  page,
  pageSize,
  totalPages,
  isLoading,
  isFetching,
  onPageChange,
  onPageSizeChange,
  emptyAction,
}: PublicationsTableProps) {
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState<PublicationSortKey>("publishedAt");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState<Set<PublicationColumnKey>>(
    () => new Set(DEFAULT_VISIBLE),
  );

  const rows = useMemo(() => {
    const searched = searchPublications(publications, search);
    return sortPublications(searched, sortKey, sortDir);
  }, [publications, search, sortKey, sortDir]);

  const handleSort = (key?: PublicationSortKey) => {
    if (!key) return;
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const onOpen = (id: string) => navigate(publicationDetailPath(id));

  const ariaSort = (key?: PublicationSortKey): "ascending" | "descending" | "none" =>
    !key ? "none" : sortKey === key ? (sortDir === "asc" ? "ascending" : "descending") : "none";

  const SortIcon = ({ sk }: { sk?: PublicationSortKey }) => {
    if (!sk) return null;
    if (sortKey !== sk) return <ArrowUpDown className="ml-1 inline h-3 w-3 text-foreground/40" aria-hidden="true" />;
    return sortDir === "asc"
      ? <ArrowUp className="ml-1 inline h-3 w-3 text-foreground" aria-hidden="true" />
      : <ArrowDown className="ml-1 inline h-3 w-3 text-foreground" aria-hidden="true" />;
  };

  const showFrom = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const showTo = Math.min(page * pageSize, total);

  return (
    <Card className="flex flex-col gap-4 p-4">
      {/* Header: title + search + columns toggle */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between pt-mobile-stack-lg">
        <h3 className="text-sm font-semibold text-foreground">
          {metricsStrings.table.title}
        </h3>
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground/40" aria-hidden="true" />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={metricsStrings.table.searchPlaceholder}
              className="h-8 pl-8 text-xs"
              aria-label={metricsStrings.table.searchPlaceholder}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                <Columns3 className="h-3.5 w-3.5" aria-hidden="true" />
                {metricsStrings.table.columnsButton}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 p-2">
              <ul className="flex flex-col gap-1">
                {ALL_COLUMNS.filter((c) => c.key !== "preview" && c.key !== "track" && c.key !== "actions").map((c) => {
                  const checked = visible.has(c.key);
                  return (
                    <li key={c.key}>
                      <label className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => {
                            setVisible((prev) => {
                              const next = new Set(prev);
                              if (checked) next.delete(c.key);
                              else next.add(c.key);
                              return next;
                            });
                          }}
                        />
                        <span className="text-sm text-foreground">{c.label}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile: stacked cards */}
      <div className={cn("relative flex flex-col gap-2 md:hidden", isFetching && "opacity-60")}>
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)
        ) : rows.length === 0 ? (
          <EmptyBlock action={emptyAction} />
        ) : (
          rows.map((p) => (
            <PublicationCardMobile key={p.id} publication={p} onOpen={onOpen} />
          ))
        )}
      </div>

      {/* Desktop: table */}
      <div className={cn("relative hidden overflow-hidden rounded-lg border border-foreground/5 md:block", isFetching && "opacity-60")}>
        <Table>
          <caption className="sr-only">{metricsStrings.table.caption}</caption>
          <TableHeader>
            <TableRow>
              {ALL_COLUMNS.filter((c) => visible.has(c.key)).map((c) => (
                <TableHead
                  key={c.key}
                  scope="col"
                  aria-sort={ariaSort(c.sortKey)}
                  className={cn(c.numeric && "text-right")}
                >
                  {c.sortKey ? (
                    <button
                      type="button"
                      onClick={() => handleSort(c.sortKey)}
                      className="inline-flex items-center hover:text-foreground"
                    >
                      {c.label}
                      <SortIcon sk={c.sortKey} />
                    </button>
                  ) : (
                    c.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  {ALL_COLUMNS.filter((c) => visible.has(c.key)).map((c) => (
                    <td key={c.key} className="p-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <td colSpan={visible.size} className="p-0">
                  <EmptyBlock action={emptyAction} />
                </td>
              </TableRow>
            ) : (
              rows.map((p) => (
                <PublicationRow
                  key={p.id}
                  publication={p}
                  visibleColumns={visible}
                  onOpen={onOpen}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer: counts + page-size + pagination */}
      {total > 0 && (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="font-tnum text-xs text-foreground/60">
            {interpolateString(metricsStrings.table.showingRange, {
              from: showFrom,
              to: showTo,
              total,
            })}
          </p>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-foreground/60">
              {metricsStrings.table.pageSize}
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="h-8 rounded-md border border-foreground/10 bg-background px-2 text-xs text-foreground"
              >
                {PAGE_SIZES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
            <TablePagination
              page={page}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      )}
    </Card>
  );
}

function EmptyBlock({ action }: { action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
      <p className="text-base font-semibold text-foreground">
        {metricsStrings.table.empty.title}
      </p>
      <p className="max-w-md text-sm text-foreground/60">
        {metricsStrings.table.empty.message}
      </p>
      {action && <div className="mt-1 flex flex-wrap justify-center gap-2">{action}</div>}
    </div>
  );
}
