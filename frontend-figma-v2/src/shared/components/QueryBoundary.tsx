import { Loader } from "./Loader";
import { ErrorState } from "./ErrorState";
import { Inbox } from "lucide-react";
import { EmptyStateCard } from "@/components/ui/empty-state-card";

/** Minimal subset we need. Loose enough to accept bespoke hooks too. */
export interface QueryLike<TData> {
  isLoading: boolean;
  isError?: boolean;
  error?: unknown;
  data: TData | undefined;
  refetch?: () => unknown;
}

interface Props<TData> {
  query: QueryLike<TData>;
  /** Predicate for an empty result. Defaults to no data / empty array. */
  isEmpty?: (data: TData) => boolean;
  /** Custom slots, all optional. */
  loading?: React.ReactNode;
  errorTitle?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  empty?: React.ReactNode;
  children: (data: TData) => React.ReactNode;
}

/**
 * Standard loading / error / empty / success renderer for React Query results.
 * Replaces ad-hoc `if (isLoading) ... if (error) ...` chains in pages.
 */
export function QueryBoundary<TData>({
  query,
  isEmpty,
  loading,
  errorTitle = "No pudimos cargar la información",
  emptyTitle = "Sin resultados",
  emptyDescription,
  empty,
  children,
}: Props<TData>) {
  if (query.isLoading) return <>{loading ?? <Loader />}</>;

  if (query.isError) {
    return (
      <ErrorState
        title={errorTitle}
        message={(query.error as { message?: string } | null)?.message}
        onRetry={query.refetch ? () => void query.refetch() : undefined}
      />
    );
  }

  const data = query.data;
  if (data === undefined) return <>{loading ?? <Loader />}</>;

  const emptyResult =
    isEmpty?.(data) ?? (Array.isArray(data) && data.length === 0);
  if (emptyResult) {
    return (
      <>
        {empty ?? (
          <EmptyStateCard icon={Inbox} title={emptyTitle} description={emptyDescription} />
        )}
      </>
    );
  }

  return <>{children(data)}</>;
}