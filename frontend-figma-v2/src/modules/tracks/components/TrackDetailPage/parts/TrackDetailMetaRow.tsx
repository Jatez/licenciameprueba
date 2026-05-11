import type { ReactNode } from "react";

interface TrackDetailMetaRowProps {
  label: string;
  children: ReactNode;
  tooltip?: string;
}

export function TrackDetailMetaRow({ label, children, tooltip }: TrackDetailMetaRowProps) {
  return (
    <div className="grid grid-cols-[120px_1fr] items-start gap-3 py-2 text-sm">
      <dt
        className="text-muted-foreground"
        title={tooltip}
      >
        {label}
      </dt>
      <dd className="text-foreground">{children}</dd>
    </div>
  );
}
