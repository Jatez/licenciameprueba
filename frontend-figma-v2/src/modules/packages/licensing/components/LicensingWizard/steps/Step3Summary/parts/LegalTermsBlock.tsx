import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { licensingStrings } from "@/modules/packages/licensing/strings";
import type { LicensingTermsResponse } from "@/api/types";

interface Props {
  terms: LicensingTermsResponse | undefined;
  isLoading: boolean;
}

export function LegalTermsBlock({ terms, isLoading }: Props) {
  const t = licensingStrings.step3;

  if (isLoading || !terms) {
    return (
      <section
        aria-label={t.sections.terms}
        className="rounded-xl border border-border bg-card p-4"
      >
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t.sections.terms}
        </h3>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-10/12" />
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label={t.sections.terms}
      className="rounded-xl border border-border bg-card p-4"
    >
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {t.sections.terms}
      </h3>
      <p className="mb-3 text-sm text-foreground">{t.terms.intro}</p>
      <ul className="mb-1 space-y-2">
        {terms.summaryBullets.map((bullet, i) => (
          <li key={i} className="flex gap-2 text-sm text-foreground">
            <span aria-hidden="true" className="mt-0.5 text-muted-foreground">
              •
            </span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
      <Accordion type="single" collapsible className="mt-2 border-t-0">
        <AccordionItem value="full-terms" className="border-b-0">
          <AccordionTrigger className="py-2 text-sm font-medium text-foreground hover:no-underline">
            {t.terms.viewFull}
          </AccordionTrigger>
          <AccordionContent>
            <div className="max-h-72 overflow-y-auto rounded-lg bg-muted/40 p-4 text-xs leading-relaxed text-foreground whitespace-pre-wrap">
              {terms.bodyMarkdown}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
