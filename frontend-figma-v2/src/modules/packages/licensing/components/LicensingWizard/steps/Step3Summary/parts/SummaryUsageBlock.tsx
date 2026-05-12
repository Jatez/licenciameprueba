import { Calendar, Film, Image, Layers, Target, Users, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { LicenseUsageType, PlatformLicensability, UsageTypeDefinition } from "@/api/types";
import { licensingStrings } from "@/modules/packages/licensing/strings";
import { formatCredits } from "@/modules/packages/licensing/utils";

const ICONS: Record<string, LucideIcon> = {
  Image,
  Layers,
  Calendar,
  Film,
  Target,
  Users,
};

interface Props {
  usageType: LicenseUsageType;
  definition: UsageTypeDefinition;
  platformLicensability: PlatformLicensability[];
}

const PLATFORM_LABEL: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
  youtube: "YouTube",
  twitter: "X",
  linkedin: "LinkedIn",
};

export function SummaryUsageBlock({
  usageType,
  definition,
  platformLicensability,
}: Props) {
  const t = licensingStrings.step3.sections;
  const usage = licensingStrings.usageTypes[usageType];
  const Icon = ICONS[definition.iconName] ?? Image;

  return (
    <section
      aria-label={t.usage}
      className="rounded-xl border border-border bg-card p-4"
    >
      <h3 className="mb-2.5 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {t.usage}
      </h3>
      <div className="flex items-start gap-3">
        <div
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground"
          aria-hidden="true"
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p className="text-sm font-semibold text-foreground">{usage.title}</p>
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold tabular-nums text-secondary-foreground">
              {formatCredits(definition.creditCost)}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {usage.description}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-[11px] text-muted-foreground">{t.platforms}</span>
        {platformLicensability.map((p) => {
          const allowed = p.allowedUsageTypes.includes(usageType);
          return (
            <Badge
              key={p.platform}
              variant={allowed ? "vigente" : "consumida"}
              className={allowed ? "px-2 py-0 text-[10px]" : "px-2 py-0 text-[10px] opacity-60"}
            >
              {PLATFORM_LABEL[p.platform] ?? p.platform} {allowed ? "✓" : "✗"}
            </Badge>
          );
        })}
      </div>
    </section>
  );
}
