/**
 * F-11 · Publication detail page (route: /metricas/publicaciones/:id).
 *
 * Thin orchestration: fetches the publication and composes the
 * header, KPIs, evidence and sync status sections.
 */
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QueryBoundary } from "@/shared/components";
import { AppPageHeader } from "@/shared/components/layout/AppPageHeader";
import { useFormatDate } from "@/shared/format";
import { usePublicationDetail } from "@/modules/monitoring/metrics/hooks/usePublicationDetail";
import { useEvidenceExport } from "@/modules/monitoring/metrics/hooks/useEvidenceExport";
import { MetricsBreadcrumb } from "@/modules/monitoring/metrics/components/MetricsBreadcrumb";
import { PublicationDetailHeader } from "@/modules/monitoring/metrics/components/PublicationDetailHeader";
import { PublicationKpis } from "@/modules/monitoring/metrics/components/PublicationKpis";
import { PublicationEvidenceCard } from "@/modules/monitoring/metrics/components/PublicationEvidenceCard";
import { PublicationSyncStatus } from "@/modules/monitoring/metrics/components/PublicationSyncStatus";
import { PublicationTrendChart } from "@/modules/monitoring/metrics/components/PublicationTrendChart";
import { metricsStrings } from "@/modules/monitoring/metrics/strings";

const MetricsPublicationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: pub, isLoading, notFound, refetch } = usePublicationDetail(id);
  const exportEvidence = useEvidenceExport();
  const { longWithTime: absoluteDate, relative: relativeDate } = useFormatDate();

  const t = metricsStrings.publicationDetail;

  const breadcrumbItems = useMemo(
    () => [
      { label: t.breadcrumbRoot, to: "/metricas" },
      { label: t.breadcrumbList, to: "/metricas" },
      { label: pub?.id ?? id ?? "—" },
    ],
    [pub?.id, id, t.breadcrumbRoot, t.breadcrumbList],
  );

  // Adapter: bridge the bespoke hook shape to QueryBoundary's UseQueryResult slice.
  const queryLike = {
    isLoading,
    isError: false,
    error: null,
    data: pub ?? undefined,
    refetch: () => refetch(),
  };

  return (
    <div className="flex flex-col gap-6">
      <AppPageHeader
        title={t.breadcrumbList}
        description="Detalle de métricas, evidencia y estado de sincronización"
        primaryAction={{
          label: t.backToMetrics,
          icon: <ArrowLeft className="h-4 w-4" aria-hidden="true" />,
          onClick: () => navigate("/metricas"),
        }}
      />
      <MetricsBreadcrumb items={breadcrumbItems} />
      <QueryBoundary
        query={queryLike}
        empty={
          notFound ? (
            <Card className="flex flex-col items-start gap-3 p-8">
              <h1 className="text-xl font-semibold text-foreground">{t.notFoundTitle}</h1>
              <p className="text-sm text-foreground/60">{t.notFoundMessage}</p>
              <Button onClick={() => navigate("/metricas")} className="gap-1.5">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {t.backToMetrics}
              </Button>
            </Card>
          ) : undefined
        }
        isEmpty={() => notFound}
      >
        {(pub) => (
          <>
            <PublicationDetailHeader
              pub={pub}
              absoluteDate={absoluteDate}
              relativeDate={relativeDate}
            />

            <PublicationKpis pub={pub} />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <PublicationTrendChart publication={pub} />
              </div>
              <PublicationEvidenceCard
                pub={pub}
                absoluteDate={absoluteDate}
                onDownload={() => exportEvidence({ id: pub.id, trackId: pub.trackId })}
              />
            </div>

            <PublicationSyncStatus
              pub={pub}
              absoluteDate={absoluteDate}
              relativeDate={relativeDate}
              onRetry={() => toast.info(t.syncRetryToast)}
            />
          </>
        )}
      </QueryBoundary>
    </div>
  );
};

export default MetricsPublicationDetailPage;
