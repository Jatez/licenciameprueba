import { useErrorStore, type AppError } from "@/stores/errorStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";

const SEVERITY_COLOR: Record<AppError["severity"], string> = {
  fatal: "destructive",
  error: "destructive",
  warning: "secondary",
} as const;

export function DevErrorLog() {
  const errors = useErrorStore((s) => s.errors);
  const clearErrors = useErrorStore((s) => s.clearErrors);

  if (errors.length === 0) {
    return (
      <p className="text-xs text-muted-foreground italic">
        Sin errores capturados en esta sesión.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {errors.length} error{errors.length !== 1 ? "es" : ""}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={clearErrors}
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Limpiar
        </Button>
      </div>
      <ScrollArea className="h-48">
        <div className="space-y-2 pr-2">
          {errors.map((e) => (
            <div
              key={e.id}
              className="rounded border border-border bg-muted/40 p-2 text-xs space-y-1"
            >
              <div className="flex items-start gap-1.5">
                <Badge
                  variant={SEVERITY_COLOR[e.severity] as "destructive" | "secondary"}
                  className="text-[10px] px-1 py-0 shrink-0"
                >
                  {e.severity}
                </Badge>
                <span className="font-medium break-all leading-tight">{e.message}</span>
              </div>
              <div className="text-muted-foreground flex gap-2 flex-wrap">
                <span>{e.source}</span>
                <span>{new Date(e.timestamp).toLocaleTimeString()}</span>
              </div>
              {e.stack && (
                <details className="text-[10px] text-muted-foreground">
                  <summary className="cursor-pointer">Stack trace</summary>
                  <pre className="mt-1 whitespace-pre-wrap break-all">{e.stack.slice(0, 400)}</pre>
                </details>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
