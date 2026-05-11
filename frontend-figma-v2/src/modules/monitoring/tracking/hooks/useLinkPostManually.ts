import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import type { ManualLinkRequest, ManualLinkResponse } from "@/api/types";

export function useLinkPostManually() {
  const queryClient = useQueryClient();
  return useMutation<ManualLinkResponse, unknown, ManualLinkRequest>({
    mutationFn: (req) => api.tracking.linkPostManually(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["detected-posts"] });
      queryClient.invalidateQueries({ queryKey: ["license-content"] });
      queryClient.invalidateQueries({ queryKey: ["licenses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
