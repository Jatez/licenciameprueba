import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CatalogSortOption } from "@/api/types";
import { catalogStrings } from "@/modules/tracks/strings";

const OPTIONS: CatalogSortOption[] = [
  "popularity-desc",
  "recent-desc",
  "title-asc",
  "title-desc",
  "duration-asc",
  "duration-desc",
  "artist-asc",
];

interface SortDropdownProps {
  value: CatalogSortOption;
  onChange: (next: CatalogSortOption) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const labels = catalogStrings.filters.sort.options;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-10 gap-1.5 rounded-full border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20"
          aria-label={catalogStrings.filters.sort.ariaLabel}
        >
          <span className="text-muted-foreground">{catalogStrings.filters.sort.label}:</span>
          <span className="font-semibold">{labels[value]}</span>
          <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {OPTIONS.map((opt) => (
          <DropdownMenuItem key={opt} onSelect={() => onChange(opt)}>
            {labels[opt]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
