import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  icon?: LucideIcon;
  badge?: string;
  children: ReactNode;
  id?: string;
  /** Optional visual density. Defaults to "comfortable". */
  density?: "comfortable" | "compact";
}
