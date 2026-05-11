import { useRef, useEffect, useCallback } from 'react';

export function useAutoScrollDrag(speed = 0.3) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const isHovering = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const rafId = useRef<number>(0);

  // Auto-scroll loop
  const autoScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el || isDragging.current || isHovering.current) {
      rafId.current = requestAnimationFrame(autoScroll);
      return;
    }

    el.scrollLeft += speed;

    // Loop: if we've scrolled past half (the duplicated content), reset
    const halfScroll = el.scrollWidth / 2;
    if (el.scrollLeft >= halfScroll) {
      el.scrollLeft -= halfScroll;
    }

    rafId.current = requestAnimationFrame(autoScroll);
  }, [speed]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      startX.current = e.pageX - el.offsetLeft;
      scrollLeftStart.current = el.scrollLeft;
      el.style.cursor = 'grabbing';
      e.preventDefault();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const x = e.pageX - el.offsetLeft;
      const walk = x - startX.current;
      el.scrollLeft = scrollLeftStart.current - walk;
    };

    const onMouseUp = () => {
      isDragging.current = false;
      el.style.cursor = 'grab';
    };

    const onMouseEnter = () => {
      isHovering.current = true;
    };

    const onMouseLeave = () => {
      isHovering.current = false;
      isDragging.current = false;
      el.style.cursor = 'grab';
    };

    el.style.cursor = 'grab';
    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    el.addEventListener('mouseenter', onMouseEnter);
    el.addEventListener('mouseleave', onMouseLeave);

    rafId.current = requestAnimationFrame(autoScroll);

    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      el.removeEventListener('mouseenter', onMouseEnter);
      el.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(rafId.current);
    };
  }, [autoScroll]);

  return containerRef;
}
