import { useEffect, useRef, useState } from "react";

interface UseHeadroomOptions {
  /** Distancia mínima desde el top en la que el header siempre se muestra. */
  topOffset?: number;
  /** Delta mínimo de scroll (px) para disparar un cambio de visibilidad. */
  threshold?: number;
}

/**
 * Headroom: scroll-aware visibility.
 *
 * Devuelve `isVisible = false` cuando el usuario hace scroll hacia abajo y
 * `true` al hacer scroll hacia arriba (o al estar cerca del top).
 *
 * Pensado para headers sticky que deben liberar espacio al leer y reaparecer
 * al instante cuando el usuario gira la rueda hacia arriba.
 */
export function useHeadroom({
  topOffset = 24,
  threshold = 12,
}: UseHeadroomOptions = {}) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const scrollTarget = document.querySelector("main");

    const readScrollTop = () => {
      if (scrollTarget instanceof HTMLElement) {
        return scrollTarget.scrollTop;
      }
      return window.scrollY;
    };

    const handleScroll = () => {
      const currentScrollY = readScrollTop();

      if (currentScrollY < topOffset) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      const delta = currentScrollY - lastScrollY.current;
      if (Math.abs(delta) < threshold) return;

      setIsVisible(delta < 0);
      lastScrollY.current = currentScrollY;
    };

    lastScrollY.current = readScrollTop();

    if (scrollTarget instanceof HTMLElement) {
      scrollTarget.addEventListener("scroll", handleScroll, { passive: true });
      return () => scrollTarget.removeEventListener("scroll", handleScroll);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [topOffset, threshold]);

  return { isVisible };
}
