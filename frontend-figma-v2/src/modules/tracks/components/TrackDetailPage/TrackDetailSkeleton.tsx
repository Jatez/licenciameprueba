import { Skeleton } from "@/components/ui/skeleton";

/** Structural skeleton for the detail page: cover, hero info, waveform, meta + matrix. */
export function TrackDetailSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-live="polite">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr] lg:gap-8">
        <Skeleton className="aspect-square w-full max-w-[240px] rounded-card lg:max-w-none" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-2/5" />
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
          </div>
          <Skeleton className="h-12 w-56" />
        </div>
      </div>

      <Skeleton className="h-32 w-full rounded-md" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-72 w-full rounded-card" />
        <Skeleton className="h-72 w-full rounded-card" />
      </div>
    </div>
  );
}
