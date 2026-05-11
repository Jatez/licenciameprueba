import { create } from "zustand";
import { useExportStore } from "@/modules/monitoring/metrics/stores/exportStore";
import type { ReportJob } from "@/modules/monitoring/metrics/types";

/**
 * Local-only "deletion" store: keeps the set of job ids the user removed
 * from the in-memory history. We don't mutate the export store directly
 * to avoid coupling it to UI deletion semantics that backend will own.
 */
interface DeletedStore {
  ids: Set<string>;
  remove: (id: string) => void;
}

const useDeletedReports = create<DeletedStore>((set, get) => ({
  ids: new Set(),
  remove: (id) => {
    const next = new Set(get().ids);
    next.add(id);
    set({ ids: next });
  },
}));

export interface UseReportsHistoryResult {
  visible: ReportJob[];
  remove: (id: string) => void;
}

export function useReportsHistory(): UseReportsHistoryResult {
  const history = useExportStore((s) => s.history);
  const deletedIds = useDeletedReports((s) => s.ids);
  const remove = useDeletedReports((s) => s.remove);
  return {
    visible: history.filter((j) => !deletedIds.has(j.id)),
    remove,
  };
}