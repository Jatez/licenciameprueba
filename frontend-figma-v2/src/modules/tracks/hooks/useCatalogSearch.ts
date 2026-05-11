import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import type { CatalogPageRequest, CatalogPageResponse } from "@/api/types";

export function useCatalogSearch(request: CatalogPageRequest) {
  return useQuery<CatalogPageResponse>({
    queryKey: ["catalog", request],
    queryFn: () => api.catalog.search(request),
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });
}
