import type { ReactNode } from "react";

interface SectionBlockProps {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export function SectionBlock({ id, title, description, children }: SectionBlockProps) {
  return (
    <section id={id} className="scroll-mt-24 py-10 border-b border-border">
      <h2 className="text-2xl font-bold text-foreground mb-1">{title}</h2>
      {description && <p className="text-muted-foreground text-sm mb-6 max-w-2xl">{description}</p>}
      <div className="space-y-6">{children}</div>
    </section>
  );
}
