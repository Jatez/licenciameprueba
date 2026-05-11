interface MomentHeaderProps {
  label: string;
  timestamp: string;
}

export function MomentHeader({ label, timestamp }: MomentHeaderProps) {
  return (
    <div className="flex items-center justify-center gap-3 py-2">
      <span className="h-px flex-1 bg-border" aria-hidden="true" />
      <time
        dateTime={timestamp}
        className="text-xs font-medium text-muted-foreground font-tnum"
      >
        {label}
      </time>
      <span className="h-px flex-1 bg-border" aria-hidden="true" />
    </div>
  );
}
