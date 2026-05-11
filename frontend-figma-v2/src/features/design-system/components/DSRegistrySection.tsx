import { useTranslation } from "react-i18next";
import { Construction } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyStateCard } from "@/components/ui/empty-state-card";
import { DSSectionHeader } from "./DSSectionHeader";
import { DSSectionBody } from "./DSSectionBody";
import { DSComponentDocCard, type DSComponentDocItem } from "./spec";

type RegistryLayout = "stack" | "split";

interface DSRegistrySectionProps {
  id: string;
  title: string;
  status?: "stable" | "beta" | "deprecated";
  lastUpdate?: string;
  componentName: string;
  description: string;
  items: DSComponentDocItem[];
  liveRoute?: string;
  /** Visual layout. Defaults to "split" (context left, registry right). */
  layout?: RegistryLayout;
  /** When true, marks the section as DRAFT and shows a placeholder preview. */
  isDraft?: boolean;
}

/**
 * Sección estándar para registrar componentes del producto en el DS.
 * Pensada para casos donde el componente real necesita providers/hooks
 * complejos (router, react-query, player) y montar el demo inline rompe
 * la página. La fuente de verdad sigue siendo el componente real en su
 * ruta — esto es el catálogo navegable.
 */
export function DSRegistrySection({
  id,
  title,
  status = "stable",
  lastUpdate,
  componentName,
  description,
  items,
  liveRoute,
  layout = "split",
  isDraft = false,
}: DSRegistrySectionProps) {
  const { t } = useTranslation("designSystem");
  const liveRouteLabel = t("componentName.openLive");

  return (
    <>
      <DSSectionHeader
        id={id}
        title={title}
        status={status}
        lastUpdate={lastUpdate}
        componentName={componentName}
      />
      {isDraft && (
        <div className="mb-4 -mt-2">
          <Badge variant="pendiente" className="text-[10px] uppercase tracking-wider">
            Draft · preview pendiente
          </Badge>
        </div>
      )}
      {layout === "stack" ? (
        <>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl mb-6">
            {description}
          </p>
          {isDraft ? (
            <DraftPlaceholder liveRoute={liveRoute} />
          ) : (
            <DSComponentDocCard items={items} liveRoute={liveRoute} liveRouteLabel={liveRouteLabel} />
          )}
        </>
      ) : (
        <DSSectionBody
          layout="split"
          left={
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              {liveRoute && (
                <a
                  href={liveRoute}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline"
                >
                  {liveRouteLabel}{" "}
                  <code className="rounded bg-muted px-1 text-xs">{liveRoute}</code>
                </a>
              )}
            </div>
          }
          right={
            isDraft ? (
              <DraftPlaceholder liveRoute={liveRoute} />
            ) : (
              <DSComponentDocCard items={items} />
            )
          }
        />
      )}
    </>
  );
}

interface DraftPlaceholderProps {
  liveRoute?: string;
}

function DraftPlaceholder({ liveRoute }: DraftPlaceholderProps) {
  return (
    <div className="rounded-card border border-dashed border-border bg-card/40">
      <EmptyStateCard
        icon={Construction}
        title="Preview en construcción"
        description={
          liveRoute
            ? `Mientras tanto, consulta la implementación viva en ${liveRoute}.`
            : "Documentación visual pendiente de completar."
        }
        ctaLabel={liveRoute ? "Ver en la app" : undefined}
        ctaHref={liveRoute}
      />
    </div>
  );
}
