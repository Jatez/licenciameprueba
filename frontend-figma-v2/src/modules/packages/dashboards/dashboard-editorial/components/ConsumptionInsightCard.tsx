import { editorialStrings } from "../strings";

/**
 * Editorial insight card on the right column of the consumption section.
 */
export function ConsumptionInsightCard() {
  const t = editorialStrings.consumption;

  return (
    <aside className="flex h-full flex-col gap-5 rounded-lg border border-border bg-card p-7 md:p-8">
      <p className="text-sm font-medium text-muted-foreground">
        {t.insightLabel}
      </p>
      <p className="font-serif text-5xl leading-none text-foreground md:text-6xl">
        {t.insightHeading}
      </p>
      <p className="text-sm text-foreground md:text-base">{t.insightCopy}</p>
      <p className="mt-auto border-t border-border pt-4 text-xs text-muted-foreground">
        {t.insightNote}
      </p>
    </aside>
  );
}
