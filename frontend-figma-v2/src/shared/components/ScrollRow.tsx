import React, { Children, cloneElement, isValidElement } from 'react';
import { useAutoScrollDrag } from '@/shared/hooks/useAutoScrollDrag';

interface ScrollRowProps {
  children: React.ReactNode;
  className?: string;
}

export function ScrollRow({ children, className = '' }: ScrollRowProps) {
  const scrollRef = useAutoScrollDrag(0.3);

  // Duplicate children for infinite loop
  const childArray = Children.toArray(children);
  const duplicated = [...childArray, ...childArray];

  return (
    <div
      ref={scrollRef}
      className={`overflow-x-auto scrollbar-hide select-none ${className}`}
      style={{
        position: 'relative',
        left: 'calc(-13.1875rem - 0.625rem)',
        width: '100vw',
        paddingLeft: 'calc(13.1875rem + 0.625rem + 1rem)',
        paddingRight: '1rem',
      }}
    >
      <div className="flex gap-5" style={{ minWidth: 'max-content' }}>
        {duplicated.map((child, i) =>
          isValidElement(child)
            ? cloneElement(child as React.ReactElement, { key: `scroll-${i}` })
            : child
        )}
      </div>
    </div>
  );
}

export function ScrollRowMobile({ children, className = '' }: ScrollRowProps) {
  const scrollRef = useAutoScrollDrag(0.3);
  const childArray = Children.toArray(children);
  const duplicated = [...childArray, ...childArray];

  return (
    <div
      ref={scrollRef}
      className={`overflow-x-auto scrollbar-hide select-none px-4 ${className}`}
    >
      <div className="flex gap-5" style={{ minWidth: 'max-content' }}>
        {duplicated.map((child, i) =>
          isValidElement(child)
            ? cloneElement(child as React.ReactElement, { key: `scroll-m-${i}` })
            : child
        )}
      </div>
    </div>
  );
}
