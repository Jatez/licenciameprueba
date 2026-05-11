import { ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { DSComponentName } from "./DSComponentName";

export interface DSComponentDocItem {
  name: string;
  description: string;
  importPath?: string;
  notes?: string[];
}

interface DSComponentDocCardProps {
  items: DSComponentDocItem[];
  liveRoute?: string;
  liveRouteLabel?: string;
  className?: string;
}

/**
 * Card-grid ligero para registrar componentes en el Design System sin
 * tener que montar demos en vivo (las páginas reales viven en su ruta).
 * Cada item muestra:
 *   - Pill copiable con el nombre canónico
 *   - Descripción en español
 *   - Path de import (opcional)
 *   - Notas internas (opcional)
 */
export function DSComponentDocCard({
  items,
  liveRoute,
  liveRouteLabel,
  className,
}: DSComponentDocCardProps) {
  const { t } = useTranslation("designSystem");

  return (
    <div className={cn("space-y-4", className)}>
      {liveRoute && (
        <a
          href={liveRoute}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          {liveRouteLabel ?? t("componentName.openLive")}{" "}
          <code className="rounded bg-muted px-1 text-xs">{liveRoute}</code>
        </a>
      )}
      <ul className="grid gap-3">
        {items.map((item) => (
          <li
            key={item.name}
            className="flex flex-col gap-2 rounded-card border border-border bg-card p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <DSComponentName name={item.name} />
              {item.importPath && (
                <code className="text-xs text-muted-foreground">
                  {item.importPath}
                </code>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{item.description}</p>
            {item.notes && item.notes.length > 0 && (
              <ul className="ml-4 list-disc space-y-1 text-xs text-muted-foreground">
                {item.notes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
