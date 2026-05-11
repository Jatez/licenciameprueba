import { useRef, useEffect, useState, type ReactNode } from "react";

interface HorizontalScrollerProps {
  children: ReactNode;
  autoScrollSpeed?: number;
}

/**
 * Drag-to-scroll + auto-scroll row, contained within the BodyCard's padding.
 * Bleeds horizontally to the BodyCard's px-10 edges (-mx-10 / px-10).
 */
export function HorizontalScroller({
  children,
  autoScrollSpeed = 0.3,
}: HorizontalScrollerProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const dragState = useRef({ startX: 0, scrollLeft: 0 });
  const rafRef = useRef<number>();

  useEffect(() => {
    const tick = () => {
      const el = scrollerRef.current;
      if (el && !isDragging && !isHovering) {
        el.scrollLeft += autoScrollSpeed;
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
          el.scrollLeft = 0;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isDragging, isHovering, autoScrollSpeed]);

  return (
    <div
      ref={scrollerRef}
      onMouseDown={(e) => {
        const el = scrollerRef.current;
        if (!el) return;
        setIsDragging(true);
        dragState.current = {
          startX: e.pageX - el.offsetLeft,
          scrollLeft: el.scrollLeft,
        };
      }}
      onMouseMove={(e) => {
        if (!isDragging) return;
        const el = scrollerRef.current;
        if (!el) return;
        e.preventDefault();
        const x = e.pageX - el.offsetLeft;
        el.scrollLeft = dragState.current.scrollLeft - (x - dragState.current.startX) * 1.5;
      }}
      onMouseUp={() => setIsDragging(false)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setIsDragging(false);
      }}
      className={`flex gap-5 overflow-x-auto overflow-y-hidden select-none no-scrollbar -mx-4 px-4 md:-mx-10 md:px-10 py-2 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
    >
      {children}
    </div>
  );
}
