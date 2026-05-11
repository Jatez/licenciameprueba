import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import type { UsageTypeCatalog } from "@/api/types";

export const USAGE_TYPE_CATALOG_KEY = ["licensing", "usage-type-catalog"] as const;

export function useUsageTypeCatalog() {
  return useQuery<UsageTypeCatalog>({
    queryKey: USAGE_TYPE_CATALOG_KEY,
    queryFn: () => api.licensing.getUsageTypeCatalog(),
    staleTime: Infinity,
  });
}
