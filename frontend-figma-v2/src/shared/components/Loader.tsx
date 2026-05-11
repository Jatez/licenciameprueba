import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoaderProps {
  /** `inline` renders a small spinner; `page` centers it in a tall area. */
  variant?: "inline" | "page";
  label?: string;
  className?: string;
}

export function Loader({ variant = "inline", label = "Cargando…", className }: LoaderProps) {
  if (variant === "page") {
    return (
      <div
        role="status"
        aria-live="polite"
        className={cn("flex min-h-[40vh] w-full flex-col items-center justify-center gap-3 text-foreground/60", className)}
      >
        <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
        <span className="text-sm">{label}</span>
      </div>
    );
  }
  return (
    <span role="status" aria-live="polite" className={cn("inline-flex items-center gap-2 text-sm text-foreground/60", className)}>
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}