import { create } from "zustand";

export type NotifToastType = "success" | "error" | "info" | "warning";

export interface NotifToast {
  id: string;
  type: NotifToastType;
  message: string;
}

interface ToastStore {
  toasts: NotifToast[];
  show: (t: { type: NotifToastType; message: string; duration?: number }) => void;
  dismiss: (id: string) => void;
}

export const useNotifToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  show: ({ type, message, duration = 4000 }) => {
    const id = crypto.randomUUID();
    set({ toasts: [...get().toasts, { id, type, message }] });
    window.setTimeout(() => get().dismiss(id), duration);
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));