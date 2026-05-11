import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CatalogPageSize } from "@/api/types";
import { catalogStrings } from "@/modules/tracks/strings";
import { interpolate } from "@/modules/tracks/utils";

const OPTIONS: CatalogPageSize[] = [25, 50, 100];

interface PageSizeSelectorProps {
  value: CatalogPageSize;
  onChange: (next: CatalogPageSize) => void;
}

export function PageSizeSelector({ value, onChange }: PageSizeSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-10 gap-1.5 rounded-full border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20"
          aria-label={catalogStrings.filters.pageSize.ariaLabel}
        >
          <span className="font-semibold">{value}</span>
          <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {OPTIONS.map((opt) => (
          <DropdownMenuItem key={opt} onSelect={() => onChange(opt)}>
            {interpolate(catalogStrings.filters.pageSize.option, { size: opt })}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
