import { Skeleton } from "@/components/ui/skeleton";

interface TrackListSkeletonProps {
  count?: number;
  variant?: "grid" | "list";
}

export function TrackListSkeleton({ count = 12, variant = "grid" }: TrackListSkeletonProps) {
  if (variant === "list") {
    return (
      <ul className="space-y-2" aria-hidden="true">
        {Array.from({ length: count }).map((_, i) => (
          <li key={i}>
            <Skeleton className="h-16 w-full rounded-card" />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <li key={i}>
          <Skeleton className="aspect-square w-full rounded-card" />
          <Skeleton className="mt-2 h-3 w-3/4" />
          <Skeleton className="mt-1 h-3 w-1/2" />
        </li>
      ))}
    </ul>
  );
}
