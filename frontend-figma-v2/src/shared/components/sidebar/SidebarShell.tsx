import { ReactNode } from 'react';

interface SidebarShellProps {
  children: ReactNode;
  variant?: 'fixed' | 'static';
  className?: string;
}

/**
 * Frosted glass sidebar container.
 * Uses the `.sidebar-frosted` recipe defined in index.css (HSL-based).
 * - `fixed`: position fixed, full viewport height (used in app shell)
 * - `static`: positioned relative within parent (used in style-guide preview)
 */
export function SidebarShell({ children, variant = 'fixed', className = '' }: SidebarShellProps) {
  const positionClasses =
    variant === 'fixed'
      ? 'fixed left-[0.625rem] top-[0.625rem] h-[calc(100dvh-1.25rem)] z-50 border-black/0 rounded-card overflow-hidden'
      : 'relative h-full';

  return (
    <aside
      className={`flex flex-col sidebar-frosted ${positionClasses} ${className}`}
      style={{ width: '13.1875rem' }}
    >
      {children}
    </aside>
  );
}
