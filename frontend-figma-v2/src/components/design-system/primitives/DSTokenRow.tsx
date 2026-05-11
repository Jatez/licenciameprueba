import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * DSTokenRow / DSTokenTable
 * -------------------------------------------------------------
 * Unified primitive for documenting design tokens across every
 * Foundation page (Colors, Spacing, Radius, Shadows, etc.).
 *
 * Goal: one consistent row anatomy for every token, regardless of
 * its category. Columns are fixed: Token | Tailwind | CSS Var |
 * Value | Demo | Usage.
 *
 * NOTE: This primitive is NOT yet wired into any foundation page.
 * See the commented usage example at the bottom of this file.
 */

export type DSTokenRowProps = {
  /** Semantic token identifier (e.g. "primary", "space-4"). */
  name: string;
  /** Tailwind utility class (e.g. "bg-primary", "p-4"). */
  tailwind?: string;
  /** CSS custom property name (e.g. "--color-primary"). */
  cssVar?: string;
  /** Raw token value (e.g. "68 81% 65%", "16px"). */
  value: string;
  /** Visual demo of the token — swatch, box, shadow, etc. */
  preview: React.ReactNode;
  /** Short prose describing where to use this token. */
  usage?: string;
};

function CopyableMono({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // noop — clipboard unavailable
    }
  }, [text]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copiar ${text}`}
      className={cn(
        "group inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1",
        "font-mono text-xs text-foreground",
        "transition-colors hover:bg-muted/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <span className="truncate">{text}</span>
      {copied ? (
        <Check className="h-3 w-3 shrink-0 text-foreground/70" aria-hidden="true" />
      ) : (
        <Copy
          className="h-3 w-3 shrink-0 text-foreground/40 opacity-0 transition-opacity group-hover:opacity-100"
          aria-hidden="true"
        />
      )}
    </button>
  );
}

export function DSTokenRow({
  name,
  tailwind,
  cssVar,
  value,
  preview,
  usage,
}: DSTokenRowProps) {
  return (
    <tr className="border-b border-border/50 transition-colors [&:nth-child(even)]:bg-muted/30 hover:bg-muted/50">
      <td className="px-4 py-3 align-middle font-mono text-sm text-foreground">
        {name}
      </td>
      <td className="px-4 py-3 align-middle">
        {tailwind ? <CopyableMono text={tailwind} /> : <span className="text-muted-foreground">—</span>}
      </td>
      <td className="px-4 py-3 align-middle">
        {cssVar ? <CopyableMono text={cssVar} /> : <span className="text-muted-foreground">—</span>}
      </td>
      <td className="px-4 py-3 align-middle font-mono text-xs text-muted-foreground">
        {value}
      </td>
      <td className="px-4 py-3 align-middle">
        <div className="flex min-h-[48px] min-w-[48px] items-center justify-center">
          {preview}
        </div>
      </td>
      <td className="px-4 py-3 align-middle text-sm text-muted-foreground">
        {usage ?? <span className="text-muted-foreground/60">—</span>}
      </td>
    </tr>
  );
}

export interface DSTokenTableProps {
  /** DSTokenRow children. */
  children: React.ReactNode;
  /** Optional caption rendered above the table for screen readers + visible label. */
  caption?: string;
  className?: string;
}

export function DSTokenTable({ children, caption, className }: DSTokenTableProps) {
  return (
    <div className={cn("relative w-full overflow-x-auto rounded-lg border border-border bg-card", className)}>
      <table className="w-full border-collapse text-left">
        {caption ? (
          <caption className="px-4 py-3 text-left text-sm font-medium text-foreground">
            {caption}
          </caption>
        ) : null}
        <thead className="sticky top-0 z-10 bg-card">
          <tr className="border-b border-border">
            <th scope="col" className="px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Token
            </th>
            <th scope="col" className="px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Tailwind
            </th>
            <th scope="col" className="px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              CSS Var
            </th>
            <th scope="col" className="px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Valor
            </th>
            <th scope="col" className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Demo
            </th>
            <th scope="col" className="px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Uso
            </th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

/* -------------------------------------------------------------
 * USAGE EXAMPLE (do NOT uncomment — for reference only)
 * -------------------------------------------------------------
 *
 * import { DSTokenRow, DSTokenTable } from "@/components/design-system/primitives/DSTokenRow";
 *
 * export function ColorsExample() {
 *   return (
 *     <DSTokenTable caption="Colores semánticos">
 *       <DSTokenRow
 *         name="primary"
 *         tailwind="bg-primary"
 *         cssVar="--color-primary"
 *         value="68 81% 65%"
 *         preview={<div className="h-10 w-10 rounded-md bg-primary" />}
 *         usage="CTA principal y elementos destacados"
 *       />
 *       <DSTokenRow
 *         name="space-4"
 *         tailwind="p-4"
 *         cssVar="--space-4"
 *         value="16px"
 *         preview={<div className="h-4 w-4 bg-foreground" />}
 *         usage="Padding base de cards y secciones compactas"
 *       />
 *       <DSTokenRow
 *         name="shadow-elegant"
 *         tailwind="shadow-elegant"
 *         cssVar="--shadow-elegant"
 *         value="0 10px 30px -10px hsl(var(--primary) / 0.3)"
 *         preview={<div className="h-10 w-10 rounded-md bg-card shadow-elegant" />}
 *         usage="Elevación de cards destacadas y modales"
 *       />
 *     </DSTokenTable>
 *   );
 * }
 */