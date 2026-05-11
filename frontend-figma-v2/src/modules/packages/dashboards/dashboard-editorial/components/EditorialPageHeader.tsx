import { ChevronDown } from "lucide-react";
import { editorialStrings } from "../strings";

/**
 * Editorial-style page header: large serif greeting + period pill + ghost export.
 * Period and export are visual-only (no handlers).
 */
export function EditorialPageHeader() {
  const t = editorialStrings.header;

  return (
    <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-4xl leading-tight text-foreground md:text-5xl">
          {t.greeting}
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground">{t.subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-pill border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
        >
          <span>{t.period}</span>
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          disabled
          className="rounded-pill border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted opacity-50 cursor-not-allowed"
        >
          {t.exportCta}
        </button>
      </div>
    </header>
  );
}
