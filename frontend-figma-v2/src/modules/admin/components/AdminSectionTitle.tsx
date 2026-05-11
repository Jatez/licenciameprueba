interface AdminSectionTitleProps {
  title: string;
  hint?: string;
}

export function AdminSectionTitle({ title, hint }: AdminSectionTitleProps) {
  return (
    <div className="flex items-end justify-between gap-3 pb-4">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {hint && <p className="text-xs text-muted-foreground hidden sm:block">{hint}</p>}
    </div>
  );
}
