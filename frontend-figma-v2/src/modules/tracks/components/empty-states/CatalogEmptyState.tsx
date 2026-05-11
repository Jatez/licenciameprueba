import { Music } from "lucide-react";
import { EmptyState } from "@/modules/packages/dashboards/dashboard/components/EmptyState";
import { catalogStrings } from "@/modules/tracks/strings";

export function CatalogEmptyState() {
  return (
    <EmptyState
      icon={Music}
      title={catalogStrings.states.empty.title}
      description={catalogStrings.states.empty.description}
    />
  );
}
