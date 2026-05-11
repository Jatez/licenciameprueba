import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import type { UnlinkPostRequest, UnlinkPostResponse } from "@/api/types";

export function useUnlinkPost() {
  const queryClient = useQueryClient();
  return useMutation<UnlinkPostResponse, unknown, UnlinkPostRequest>({
    mutationFn: (req) => api.tracking.unlinkPost(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["detected-posts"] });
      queryClient.invalidateQueries({ queryKey: ["license-content"] });
      queryClient.invalidateQueries({ queryKey: ["licenses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
