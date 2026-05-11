import { ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlatformIcon } from "../shared/PlatformIcon";
import type { ManualLinkFormValues } from "./ManualLinkForm";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ManualLinkPreviewProps {
  values: ManualLinkFormValues;
  onChange: () => void;
}

export function ManualLinkPreview({ values, onChange }: ManualLinkPreviewProps) {
  const t = trackingStrings.manualLink.preview;
  const date = format(new Date(values.publishedAt), "PPp", { locale: es });

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase text-muted-foreground">
          {t.title}
        </span>
        <Button variant="link" size="sm" onClick={onChange} className="h-auto p-0">
          {t.changeBtn}
        </Button>
      </div>
      <Card className="flex items-center gap-3 p-3">
        <PlatformIcon platform={values.platform} size={18} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">
            {trackingStrings.manualLink.postTypeLabels[values.postType]} · {date}
          </p>
          <a
            href={values.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 truncate text-xs text-muted-foreground hover:underline"
          >
            <ExternalLink size={12} aria-hidden="true" />
            {values.externalUrl}
          </a>
        </div>
      </Card>
    </div>
  );
}
