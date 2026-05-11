import { useMemo, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface DSCatalogDemoWrapperProps {
  children: ReactNode;
  /** Visual frame around the demo. Defaults to "soft" (border-dashed). */
  frame?: "soft" | "none";
  className?: string;
}

/**
 * Isolation wrapper for live previews of catalog components inside the DS.
 *
 * Purpose:
 *   Many catalog components depend on `useToggleFavorite` (react-query
 *   mutation) and Radix `Tooltip`. Mounting them inside the DS page would
 *   leak side-effects across previews (shared QueryClient). This wrapper
 *   isolates each preview with a local QueryClient + TooltipProvider.
 *
 * Routing:
 *   The DS already lives under the global `<BrowserRouter>` declared in
 *   `App.tsx`. We deliberately do NOT mount a nested router here — React
 *   Router v6 throws on nested routers. Components that call `useNavigate`
 *   (e.g. `TrackCard`, `TrackRow`) navigate to the real product routes
 *   (`/catalog/track/:id`, `/licensing/new`), which is acceptable inside
 *   the DS: the previews are demos, and clicking through to the real screen
 *   is consistent behaviour.
 *
 * Notes:
 *   - We do NOT mock `usePlayer` (Zustand). Clicking play in the DS will
 *     update the global player store; that is acceptable because the
 *     persistent player handles unknown previewUrl gracefully and stops on
 *     its own.
 *   - The frame is purely cosmetic — it differentiates "this is a live
 *     preview" from the surrounding DS chrome.
 */
export function DSCatalogDemoWrapper({
  children,
  frame = "soft",
  className,
}: DSCatalogDemoWrapperProps) {
  // New QueryClient per wrapper instance → no shared cache between previews.
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: false, staleTime: Infinity },
          mutations: { retry: false },
        },
      }),
    [],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={150}>
        <div
          className={cn(
            frame === "soft" &&
              "rounded-card border border-dashed border-border bg-page-bg/60 p-4",
            className,
          )}
        >
          {children}
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
