import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import type { ListLicensesRequest, ListLicensesResponse } from "@/api/types";

export const LICENSES_LIST_KEY = (req: ListLicensesRequest) =>
  ["licenses", "list", req] as const;

export function useListLicenses(request: ListLicensesRequest) {
  return useQuery<ListLicensesResponse>({
    queryKey: LICENSES_LIST_KEY(request),
    queryFn: () => api.licensing.listLicenses(request),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
