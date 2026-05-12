import { AlertCircle, FileQuestion } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { isApiError } from "@/api";
import { AppPageHeader } from "@/shared/components/layout/AppPageHeader";
import {
  useCancelLicense,
  useLicenseDetail,
} from "@/modules/packages/licensing/hooks";
import { useLicensingTerms } from "@/modules/packages/licensing/hooks/useLicensingTerms";
import { licensingStrings } from "@/modules/packages/licensing/strings";
import { LicenseDetailHeader } from "./LicenseDetailHeader";
import { LicenseDetailInfoBlock } from "./LicenseDetailInfoBlock";
import { LicenseTimelineBlock } from "./LicenseTimelineBlock";
import { LicenseAssociatedContent } from "./LicenseAssociatedContent";
import { LicenseCancellationBlock } from "./LicenseCancellationBlock";
import { CancellationDialog } from "../CancellationDialog";

export function LicenseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useLicenseDetail(id);
  const terms = useLicensingTerms();
  const cancelMutation = useCancelLicense();
  const [cancelOpen, setCancelOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
        <Skeleton className="h-32 rounded-xl" />
      </div>
    );
  }

  if (isError) {
    const code = isApiError(error) ? error.code : null;
    const t =
      code === "LICENSE_NOT_FOUND"
        ? licensingStrings.detail.notFound
        : { ...licensingStrings.detail.error, description: "", cta: licensingStrings.detail.error.cta };
    const Icon = code === "LICENSE_NOT_FOUND" ? FileQuestion : AlertCircle;
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border p-12 text-center">
        <Icon className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-foreground">{t.title}</h2>
          {"description" in t && t.description && (
            <p className="max-w-md text-sm text-muted-foreground">
              {t.description}
            </p>
          )}
        </div>
        {code === "LICENSE_NOT_FOUND" ? (
          <Button onClick={() => navigate("/licenses")}>{t.cta}</Button>
        ) : (
          <Button onClick={() => refetch()}>{t.cta}</Button>
        )}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
        {licensingStrings.detail.error.title}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <AppPageHeader
        title={data.licenseTokenId}
        description="Detalle de licencia y evidencia asociada"
        primaryAction={{
          label: licensingStrings.detail.backToList,
          onClick: () => navigate("/licenses"),
        }}
      />

      <LicenseDetailHeader
        license={data}
        terms={terms.data}
        onCancelClick={() => setCancelOpen(true)}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <LicenseDetailInfoBlock
          license={data}
          termsVersion={terms.data?.version}
        />
        <LicenseTimelineBlock license={data} />
      </div>

      <LicenseAssociatedContent license={data} />

      <LicenseCancellationBlock
        license={data}
        onCancelClick={() => setCancelOpen(true)}
      />

      <CancellationDialog
        license={cancelOpen ? data : null}
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        cancelMutation={cancelMutation}
      />
    </div>
  );
}
