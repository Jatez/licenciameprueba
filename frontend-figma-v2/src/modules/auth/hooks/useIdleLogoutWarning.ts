import { useEffect, useRef, useState } from "react";

type Options = {
  /** Total inactivity before warning fires (ms). */
  idleMs: number;
  /** Whether to actually arm the timer. */
  enabled?: boolean;
};

/**
 * MOCK ONLY — fires a warning state after `idleMs` of no user input.
 * UI demo helper, no real auth implications.
 */
export function useIdleLogoutWarning({ idleMs, enabled = true }: Options) {
  const [warning, setWarning] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const reset = () => {
      setWarning(false);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setWarning(true), idleMs);
    };
    const events: (keyof WindowEventMap)[] = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((ev) => window.addEventListener(ev, reset, { passive: true }));
    reset();
    return () => {
      events.forEach((ev) => window.removeEventListener(ev, reset));
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [idleMs, enabled]);

  return { warning, dismiss: () => setWarning(false) };
}
