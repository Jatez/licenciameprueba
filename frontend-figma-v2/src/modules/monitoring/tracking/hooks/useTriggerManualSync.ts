import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";

export function useTriggerManualSync() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.tracking.triggerManualSync(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sync-status"] });
      queryClient.invalidateQueries({ queryKey: ["detected-posts"] });
    },
  });
}
