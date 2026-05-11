import { ArrowRight } from "lucide-react";

interface DSCrossRefBannerProps {
  /** Anchor id of the source-of-truth section, e.g. "typography". */
  targetId: string;
  /** Display name of the source-of-truth section, e.g. "Foundations / Typography". */
  targetLabel: string;
  /** What the current page adds on top of the source. */
  scope: string;
}

/**
 * Cross-reference banner used at the top of secondary sections that
 * documents only deltas over a canonical source-of-truth section.
 *
 * Example: Responsive/Typography → Foundations/Typography.
 */
export function DSCrossRefBanner({ targetId, targetLabel, scope }: DSCrossRefBannerProps) {
  return (
    <div className="mb-6 rounded-card border border-border bg-primary-subtle px-4 py-3 flex items-start gap-3">
      <ArrowRight className="h-4 w-4 text-foreground mt-0.5 shrink-0" aria-hidden="true" />
      <p className="text-sm text-foreground leading-relaxed">
        Tokens base en{" "}
        <a href={`#${targetId}`} className="font-semibold underline underline-offset-2">
          {targetLabel}
        </a>
        . Esta página solo documenta {scope}.
      </p>
    </div>
  );
}
