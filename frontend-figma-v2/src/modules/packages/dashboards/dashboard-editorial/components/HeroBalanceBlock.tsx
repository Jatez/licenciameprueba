import { ArrowRight } from "lucide-react";
import { editorialStrings } from "../strings";

/**
 * Lime-saturated hero block. Breaks the grid: full width, ~280-320px tall.
 * Left side carries the headline number; right side carries the consumption viz.
 */
export function HeroBalanceBlock() {
  const t = editorialStrings.hero;
  const consumedPercent = 30;

  return (
    <section className="rounded-card bg-primary px-8 py-10 text-primary-foreground md:px-12 md:py-12">
      <div className="grid gap-10 md:grid-cols-5 md:gap-12">
        {/* Left — headline number + CTAs (3 of 5 cols ~= 60%) */}
        <div className="flex flex-col gap-6 md:col-span-3">
          <p className="text-sm font-medium uppercase tracking-wide text-primary-foreground/70">
            {t.label}
          </p>

          <div className="flex flex-wrap items-end gap-x-5 gap-y-2">
            <span className="font-serif text-7xl leading-none md:text-8xl lg:text-9xl">
              420
            </span>
            <span className="pb-2 text-base text-primary-foreground/80 md:text-lg">
              {t.available}
            </span>
          </div>

          <p className="text-sm text-primary-foreground/80 md:text-base">
            {t.expiry}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              className="rounded-pill bg-lm-black px-5 py-2.5 text-sm font-medium text-primary transition-opacity hover:opacity-90"
            >
              {t.primaryCta}
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-pill px-3 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-70"
            >
              {t.secondaryCta}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Right — consumption viz (2 of 5 cols ~= 40%) */}
        <div className="flex flex-col gap-6 md:col-span-2 md:justify-center">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium uppercase tracking-wide text-primary-foreground/70">
              {t.consumedLabel}
            </p>
            <div className="h-3 w-full overflow-hidden rounded-pill bg-lm-black/15">
              <div
                className="h-full rounded-pill bg-lm-black"
                style={{ width: `${consumedPercent}%` }}
              />
            </div>
          </div>

          <ul className="flex flex-col gap-2 text-sm text-primary-foreground/85 md:text-base">
            <li>{t.consumed}</li>
            <li>{t.licensesIssued}</li>
            <li>{t.average}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
