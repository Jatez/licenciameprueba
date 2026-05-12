import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { socialStrings } from "@/modules/social/strings";

interface SocialAccountsHeaderProps {
  connected: number;
  total: number;
  isLoading?: boolean;
  compact?: boolean;
}

function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

export function SocialAccountsHeader({
  connected,
  total,
  isLoading,
  compact = false,
}: SocialAccountsHeaderProps) {
  const pct = total > 0 ? Math.round((connected / total) * 100) : 0;

  const counter = (
    <div
      className="flex items-center gap-3 rounded-full bg-lm-gray-100 px-4 py-2 self-start"
      aria-label={socialStrings.counter.aria}
    >
      {isLoading ? (
        <>
          <Skeleton className="h-2 w-32 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </>
      ) : (
        <>
          <Progress value={pct} className="h-2 w-32" />
          <span className="text-sm font-medium text-foreground whitespace-nowrap">
            {interpolate(socialStrings.counter.label, { connected, total })}
          </span>
        </>
      )}
    </div>
  );

  if (compact) return counter;

  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="space-y-2 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {socialStrings.header.title}
        </h1>
        <p className="text-muted-foreground text-sm">{socialStrings.header.subtitle}</p>
      </div>

      {counter}
    </header>
  );
}
