import { useEffect, useState } from "react";

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

/**
 * Tracks the bounding rect of a DOM node matching `selector`.
 * Re-measures on resize/scroll and via a 200ms polling fallback (covers
 * route transitions and lazy-mounted content).
 *
 * Returns null if the element is not present yet.
 */
export function useSpotlightTarget(
  selector: string | undefined,
  fallbackSelector?: string,
  enabled = true,
): { rect: TargetRect | null; element: Element | null } {
  const [rect, setRect] = useState<TargetRect | null>(null);
  const [element, setElement] = useState<Element | null>(null);

  useEffect(() => {
    if (!enabled || !selector) {
      setRect(null);
      setElement(null);
      return;
    }

    let raf = 0;
    let cancelled = false;

    const measure = () => {
      if (cancelled) return;
      const el =
        document.querySelector(selector) ??
        (fallbackSelector ? document.querySelector(fallbackSelector) : null);
      if (!el) {
        setElement(null);
        setRect(null);
        return;
      }
      const r = el.getBoundingClientRect();
      setElement(el);
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    };

    measure();
    const interval = window.setInterval(measure, 200);

    const onScrollOrResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
      cancelAnimationFrame(raf);
    };
  }, [selector, fallbackSelector, enabled]);

  return { rect, element };
}
