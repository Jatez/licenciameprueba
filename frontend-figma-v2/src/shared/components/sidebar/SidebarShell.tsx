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
      ? 'fixed left-0 top-0 h-screen z-50 border-black/0'
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
