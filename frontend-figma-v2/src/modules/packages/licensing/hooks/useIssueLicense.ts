import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import type {
  IssueLicenseRequest,
  IssueLicenseResponse,
  LicensingErrorCode,
} from "@/api/types";

export interface IssueLicenseError {
  code: LicensingErrorCode | string;
  message: string;
}

export function useIssueLicense() {
  const queryClient = useQueryClient();
  return useMutation<IssueLicenseResponse, IssueLicenseError, IssueLicenseRequest>({
    mutationFn: (req) => api.licensing.issueLicense(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["licenses"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-activity"] });
    },
  });
}
