import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CatalogViewMode } from "@/stores/catalogStore";
import { catalogStrings } from "@/modules/tracks/strings";
import { TouchTooltip } from "@/shared/components";

interface ViewModeToggleProps {
  value: CatalogViewMode;
  onChange: (next: CatalogViewMode) => void;
}

export function ViewModeToggle({ value, onChange }: ViewModeToggleProps) {
  return (
    <div
      role="group"
      aria-label="Modo de vista"
      className="inline-flex items-center rounded-full border border-border bg-surface p-0.5"
    >
      <ToggleButton
        active={value === "grid"}
        onClick={() => onChange("grid")}
        label={catalogStrings.viewMode.grid}
      >
        <LayoutGrid className="h-4 w-4" aria-hidden="true" />
      </ToggleButton>
      <ToggleButton
        active={value === "list"}
        onClick={() => onChange("list")}
        label={catalogStrings.viewMode.list}
      >
        <List className="h-4 w-4" aria-hidden="true" />
      </ToggleButton>
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <TouchTooltip label={label}>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        aria-pressed={active}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          active ? "bg-primary text-ink-900" : "text-muted-foreground hover:text-foreground",
        )}
      >
        {children}
      </button>
    </TouchTooltip>
  );
}
