import { ReactNode } from "react";
import { AdminFrostedHeader } from "./AdminFrostedHeader";

interface AdminPageTitleProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function AdminPageTitle({ title, subtitle, actions }: AdminPageTitleProps) {
  return (
    <AdminFrostedHeader>
      <div className="flex flex-wrap items-end justify-between gap-4 pt-2">
        <div className="space-y-1.5 max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground md:text-base">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </AdminFrostedHeader>
  );
}
