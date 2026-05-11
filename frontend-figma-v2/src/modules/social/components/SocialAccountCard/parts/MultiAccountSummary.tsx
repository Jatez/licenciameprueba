import { Badge } from "@/components/ui/badge";
import { socialStrings } from "@/modules/social/strings";

interface MultiAccountSummaryProps {
  primaryUsername: string;
  extraCount: number;
}

function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

export function MultiAccountSummary({
  primaryUsername,
  extraCount,
}: MultiAccountSummaryProps) {
  const copy = socialStrings.manage;
  const template = extraCount === 1 ? copy.multiSummary : copy.multiSummaryPlural;

  return (
    <span className="inline-flex items-center gap-2 text-foreground">
      <span className="truncate">
        {interpolate(template, {
          username: primaryUsername,
          count: String(extraCount),
        })}
      </span>
      <Badge variant="secondary" className="rounded-full px-2 text-xs">
        +{extraCount}
      </Badge>
    </span>
  );
}
