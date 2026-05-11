import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DSSectionHeader } from "../../components/DSSectionHeader";
import { DSTokenRow, DSTokenTable } from "@/components/design-system/primitives/DSTokenRow";
import { getDSLastUpdated } from "@/config/designSystem";
import { LayoutDesktopMock, LayoutMobileMock } from "./parts/LayoutMocks";

const SPEC_ROWS = ["pageBg", "bodyBg", "sidebarBg", "sidebarWidth", "gap", "bodyRadius", "bodyPadding", "stickyHeader", "accent"] as const;
const CHECKS = ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8"] as const;

const LAYOUT_SPEC = `# Layout Dashboard v2

App shell con PageShell + AppSidebar (fixed, 211px, frosted blur 60px) + BodyCard (#F3F4F6, m-[0.625rem], rounded-card, px-10 py-12, md:ml-[calc(13.1875rem+0.625rem)]). HorizontalScroller con margenes negativos para pasar bajo el sidebar.

Ver /dashboard03 y /design-system#layout-dashboard-v2.`;

/**
 * Mapeo de cada fila del spec a un token real del DS (Tailwind / CSS var).
 * Permite renderizarlas dentro de DSTokenTable con la misma anatomía que
 * Foundations (Colors, Spacing, Radius...).
 */
const SPEC_TOKEN_MAP: Record<
  (typeof SPEC_ROWS)[number],
  { tailwind?: string; cssVar?: string; preview: ReactNode }
> = {
  pageBg: {
    tailwind: "bg-page-bg",
    cssVar: "--page-bg",
    preview: <div className="h-8 w-12 rounded border border-border bg-page-bg" />,
  },
  bodyBg: {
    tailwind: "bg-bodycard-bg",
    cssVar: "--bodycard-bg",
    preview: <div className="h-8 w-12 rounded border border-border bg-bodycard-bg" />,
  },
  sidebarBg: {
    tailwind: "bg-sidebar-bg",
    cssVar: "--sidebar-bg",
    preview: <div className="h-8 w-12 rounded bg-sidebar-bg" />,
  },
  sidebarWidth: {
    cssVar: "--sidebar-width",
    preview: <div className="h-2 w-12 rounded bg-foreground" />,
  },
  gap: {
    cssVar: "--bodycard-gap",
    preview: <div className="h-2 w-2 rounded-sm bg-foreground" />,
  },
  bodyRadius: {
    tailwind: "rounded-card",
    cssVar: "--radius-card",
    preview: <div className="h-8 w-12 rounded-card border border-border bg-card" />,
  },
  bodyPadding: {
    tailwind: "px-10 py-12",
    preview: (
      <div className="flex h-8 w-12 items-center justify-center rounded border border-dashed border-border bg-muted/40">
        <div className="h-3 w-6 rounded-sm bg-foreground/40" />
      </div>
    ),
  },
  stickyHeader: {
    tailwind: "sticky -top-12 backdrop-blur",
    preview: (
      <div className="flex h-8 w-12 flex-col overflow-hidden rounded border border-border">
        <div className="h-2 w-full bg-foreground/70" />
        <div className="flex-1 bg-card" />
      </div>
    ),
  },
  accent: {
    tailwind: "bg-primary",
    cssVar: "--primary",
    preview: <div className="h-8 w-12 rounded bg-primary" />,
  },
};

export function LayoutDashboardV2Section() {
  const { t } = useTranslation("designSystem");
  const h = t("sections.layoutDashboardV2.headers", { returnObjects: true }) as Record<string, string>;

  return (
    <>
      <DSSectionHeader
        id="layout-dashboard-v2"
        title={t("sections.layoutDashboardV2.title")}
        status="stable"
        lastUpdate={getDSLastUpdated("layout-dashboard-v2")}
        componentName="<AppLayout /> · <PageShell /> · <BodyCard />"
      />
      <p className="text-sm text-muted-foreground mb-6">{t("sections.layoutDashboardV2.intro")}</p>

      <div className="mb-8">
        <DSTokenTable caption={t("sections.layoutDashboardV2.specCaption", { defaultValue: "Tokens del shell del Dashboard v2" })}>
          {SPEC_ROWS.map((k) => {
            const row = t(`sections.layoutDashboardV2.specRows.${k}`, { returnObjects: true }) as [string, string];
            const meta = SPEC_TOKEN_MAP[k];
            return (
              <DSTokenRow
                key={k}
                name={row[0]}
                tailwind={meta.tailwind}
                cssVar={meta.cssVar}
                value={row[1]}
                preview={meta.preview}
                usage={row[0]}
              />
            );
          })}
        </DSTokenTable>
      </div>

      <h3 className="text-lg font-medium text-foreground scroll-mt-32 mb-3">
        {t("sections.layoutDashboardV2.desktop")}
      </h3>
      <LayoutDesktopMock />

      <h3 className="text-lg font-medium text-foreground scroll-mt-32 mb-3">
        {t("sections.layoutDashboardV2.mobile")}
      </h3>
      <LayoutMobileMock />

      <h3 className="text-lg font-medium text-foreground scroll-mt-32 mb-3">
        {t("sections.layoutDashboardV2.layers")}
      </h3>
      <div className="bg-lm-black rounded-card p-5 mb-6 font-mono text-xs">
        <div className="text-primary">z=60  AppMobileDrawer</div>
        <div className="text-background/80">z=50  AppSidebar (frosted)</div>
        <div className="text-background/60">z=20  Cards internas</div>
        <div className="text-background/50">z=10  BodyCard</div>
        <div className="text-background/40">z=0   PageShell</div>
      </div>

      <h3 className="text-lg font-medium text-foreground scroll-mt-32 mb-3">
        {t("sections.layoutDashboardV2.usage")}
      </h3>
      <div className="bg-lm-black rounded-card p-5 mb-6 overflow-x-auto">
        <pre className="text-xs text-primary"><code>{`import { AppLayout } from "@/shared/components/layout";

<Route path="/dashboard03" element={<AppLayout />}>
  <Route index element={<Dashboard03 />} />
</Route>`}</code></pre>
      </div>

      <h3 className="text-lg font-medium text-foreground scroll-mt-32 mb-3">
        {t("sections.layoutDashboardV2.checklist")}
      </h3>
      <ul className="space-y-1.5 text-sm text-foreground mb-4">
        {CHECKS.map((k) => (
          <li key={k} className="flex items-start gap-2">
            <span className="text-success font-bold leading-5" aria-hidden="true">✓</span>
            <span>{t(`sections.layoutDashboardV2.checks.${k}`)}</span>
          </li>
        ))}
      </ul>

      <Button
        size="sm"
        variant="secondary"
        onClick={() => navigator.clipboard.writeText(LAYOUT_SPEC).then(() => toast.success("Layout v2 spec copiado"))}
      >
        <Copy className="h-3.5 w-3.5" /> {t("actions.copyLayoutSpec")}
      </Button>
    </>
  );
}
