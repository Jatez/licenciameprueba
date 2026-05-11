import { useTranslation } from "react-i18next";
import { Accessibility } from "lucide-react";
import { CollapsibleSection } from "../CollapsibleSection";
import { DSA11y } from "./DSA11y";

interface DSCollapsibleA11yProps {
  items: string[];
  defaultOpen?: boolean;
}

/**
 * Wraps DSA11y in a CollapsibleSection (collapsed by default per DS rules).
 * Internal heading from DSA11y is hidden; the collapsible header replaces it.
 */
export function DSCollapsibleA11y({ items, defaultOpen = false }: DSCollapsibleA11yProps) {
  const { t } = useTranslation("designSystem");
  return (
    <CollapsibleSection
      title={t("spec.headings.a11y")}
      icon={Accessibility}
      defaultOpen={defaultOpen}
      badge={`${items.length}`}
    >
      <div className="-mt-6">
        <DSA11y items={items} />
      </div>
    </CollapsibleSection>
  );
}
