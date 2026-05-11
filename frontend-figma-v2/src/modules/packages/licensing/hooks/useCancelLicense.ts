import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import type {
  CancelLicenseRequest,
  CancelLicenseResponse,
  CancellationErrorCode,
} from "@/api/types";

export interface CancelLicenseError {
  code: CancellationErrorCode | string;
  message: string;
}

export function useCancelLicense() {
  const queryClient = useQueryClient();
  return useMutation<CancelLicenseResponse, CancelLicenseError, CancelLicenseRequest>({
    mutationFn: (req) => api.licensing.cancelLicense(req),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["licenses"] });
      queryClient.invalidateQueries({
        queryKey: ["licenses", "detail", variables.licenseId],
      });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-activity"] });
    },
  });
}
