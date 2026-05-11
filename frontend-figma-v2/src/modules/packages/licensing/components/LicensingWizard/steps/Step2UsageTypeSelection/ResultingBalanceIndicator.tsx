import { cn } from "@/lib/utils";
import { licensingStrings, formatString } from "@/modules/packages/licensing/strings";

interface Props {
  current: number;
  resulting: number;
}

export function ResultingBalanceIndicator({ current, resulting }: Props) {
  const isZero = resulting === 0;
  return (
    <p
      aria-live="polite"
      className={cn(
        "text-sm tabular-nums",
        isZero ? "font-medium text-warning" : "text-muted-foreground",
      )}
    >
      {isZero
        ? licensingStrings.step2.resultingBalanceZero
        : formatString(licensingStrings.step2.resultingBalance, {
            current,
            resulting,
          })}
    </p>
  );
}
