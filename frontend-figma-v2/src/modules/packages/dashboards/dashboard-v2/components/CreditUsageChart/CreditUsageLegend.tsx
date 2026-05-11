import { dashboardV2Strings } from "../../strings";
import type { LicenseUsageType } from "@/api/types.dashboard";
import { chartColor } from "@/design-system/tokens/chartPalette";

export const USAGE_TYPE_ORDER: LicenseUsageType[] = [
  "single-use",
  "stories-pack",
  "monthly-extended",
  "long-video",
  "paid-post",
  "collaborative-post",
];

/**
 * Mapping tipo de uso → slot de la paleta de charts del DS.
 * Los colores reales viven en `@/design-system/tokens/chartPalette`.
 */
export const USAGE_TYPE_COLORS: Record<LicenseUsageType, string> = {
  "single-use": chartColor(1),
  "stories-pack": chartColor(2),
  "monthly-extended": chartColor(3),
  "long-video": chartColor(4),
  "paid-post": chartColor(5),
  "collaborative-post": chartColor(6),
};

interface CreditUsageLegendProps {
  visible: Record<LicenseUsageType, boolean>;
  onToggle: (type: LicenseUsageType) => void;
  appearance?: "light" | "dark";
}

export function CreditUsageLegend({ visible, onToggle, appearance = "light" }: CreditUsageLegendProps) {
  const labels = dashboardV2Strings.creditUsage.usageTypes;
  const isDark = appearance === "dark";
  const buttonClass = isDark
    ? "inline-flex items-center gap-1.5 rounded-full border border-background/15 bg-background/5 px-2.5 py-1 text-xs text-background transition-opacity hover:bg-background/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background/50 data-[hidden=true]:opacity-40"
    : "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs text-foreground transition-opacity hover:bg-muted/60 data-[hidden=true]:opacity-40";
  return (
    <ul className="flex flex-wrap gap-2 pt-3">
      {USAGE_TYPE_ORDER.map((type) => (
        <li key={type}>
          <button
            type="button"
            onClick={() => onToggle(type)}
            aria-pressed={visible[type]}
            className={buttonClass}
            data-hidden={!visible[type]}
          >
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: USAGE_TYPE_COLORS[type] }}
            />
            <span>{labels[type]}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
