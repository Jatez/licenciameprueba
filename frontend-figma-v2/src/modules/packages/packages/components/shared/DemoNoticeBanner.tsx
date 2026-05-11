import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DemoNoticeBannerProps {
  message: string;
  className?: string;
  tone?: "warning" | "neutral";
}

export function DemoNoticeBanner({
  message,
  className,
  tone = "warning",
}: DemoNoticeBannerProps) {
  return (
    <div
      role="note"
      className={cn(
        "flex items-start gap-2 rounded-lg border px-3 py-2 text-sm",
        tone === "warning"
          ? "border-warning/40 bg-warning-subtle text-[#92400E]"
          : "border-border bg-muted text-muted-foreground",
        className,
      )}
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
