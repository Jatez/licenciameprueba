import { useTranslation } from "react-i18next";
import { Palette } from "lucide-react";
import { CollapsibleSection } from "../CollapsibleSection";
import { DSTokens } from "./DSTokens";

interface DSCollapsibleTokensProps {
  tokens: string[];
  defaultOpen?: boolean;
}

export function DSCollapsibleTokens({ tokens, defaultOpen = false }: DSCollapsibleTokensProps) {
  const { t } = useTranslation("designSystem");
  return (
    <CollapsibleSection
      title={t("spec.headings.tokens")}
      icon={Palette}
      defaultOpen={defaultOpen}
      badge={`${tokens.length}`}
    >
      <div className="-mt-6">
        <DSTokens tokens={tokens} />
      </div>
    </CollapsibleSection>
  );
}
