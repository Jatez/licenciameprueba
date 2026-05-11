/**
 * errorStore — captura errores de runtime de la app (ErrorBoundary, API, unhandled).
 * Session-only, nunca persistido. Máximo 100 entradas (circular).
 */
import { create } from "zustand";

export type AppErrorSeverity = "fatal" | "error" | "warning";

export interface AppError {
  id: string;
  timestamp: string;
  severity: AppErrorSeverity;
  message: string;
  source: string; // e.g. "ErrorBoundary", "AsyncErrorBoundary", "unhandledrejection"
  stack?: string;
  componentStack?: string;
  extra?: Record<string, unknown>;
}

interface ErrorStoreState {
  errors: AppError[];
  captureError: (opts: Omit<AppError, "id" | "timestamp">) => void;
  clearErrors: () => void;
}

const MAX_ERRORS = 100;

export const useErrorStore = create<ErrorStoreState>((set) => ({
  errors: [],

  captureError: (opts) => {
    const entry: AppError = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      ...opts,
    };
    set((s) => ({
      errors: [entry, ...s.errors].slice(0, MAX_ERRORS),
    }));
  },

  clearErrors: () => set({ errors: [] }),
}));

/** Shorthand imperativo — usable fuera de componentes */
export const captureError = (opts: Omit<AppError, "id" | "timestamp">) =>
  useErrorStore.getState().captureError(opts);
