import { useMemo, useState } from "react";
import { NAV_GROUPS } from "./config/navigation";
import { useScrollSpy } from "./hooks/useScrollSpy";
import { useSearchFilter } from "./hooks/useSearchFilter";
import { DSTopBar } from "./components/DSTopBar";
import { DSSidebar } from "./components/DSSidebar";
import { DSSectionShell } from "./components/DSSectionShell";

import { IntroSection } from "./sections/get-started/IntroSection";
import { PrinciplesSection } from "./sections/get-started/PrinciplesSection";
import { ChangelogSection } from "./sections/get-started/ChangelogSection";
import { ContributingSection } from "./sections/get-started/ContributingSection";
import { BrandSection } from "./sections/brand/BrandSection";
import { VoiceToneSection } from "./sections/brand/VoiceToneSection";
import { ColorsSection } from "./sections/foundations/ColorsSection";
import { TypographySection } from "./sections/foundations/TypographySection";
import { RadiusSection } from "./sections/foundations/RadiusSection";
import { SpacingSection } from "./sections/foundations/SpacingSection";
import { BordersSection } from "./sections/foundations/BordersSection";
import { AnimationsSection } from "./sections/foundations/AnimationsSection";
import { ShadowsSection } from "./sections/foundations/ShadowsSection";
import { IconsSection } from "./sections/foundations/IconsSection";
import { ButtonsSection } from "./sections/components/ButtonsSection";
import { CardsSection } from "./sections/components/CardsSection";
import { KPICardSection } from "./sections/components/KPICardSection";
import { EmptyStateCardSection } from "./sections/components/EmptyStateCardSection";
import { TopItemRowSection } from "./sections/components/TopItemRowSection";
import { AvatarSection } from "./sections/components/AvatarSection";
import { ImageOverlayCardSection } from "./sections/components/ImageOverlayCardSection";
import { FormsSection } from "./sections/components/FormsSection";
import { BadgesSection } from "./sections/components/BadgesSection";
import { MaterialsSection } from "./sections/components/MaterialsSection";
import { FrostedHeaderSection } from "./sections/components/FrostedHeaderSection";
import { PlayerSection } from "./sections/components/PlayerSection";
import { SidebarSection } from "./sections/components/SidebarSection";
import { PopoverSection } from "./sections/components/PopoverSection";
import { LayoutDashboardV2Section } from "./sections/layouts/LayoutDashboardV2Section";
import { PageShellSection } from "./sections/layouts/PageShellSection";
import { BodyCardSection } from "./sections/layouts/BodyCardSection";
import { AppLayoutSection } from "./sections/layouts/AppLayoutSection";

import {
  ResponsiveTOCSection,
  BreakpointsSection,
  LayoutPatternsSection,
  TypographyScaleSection,
  SpacingResponsiveSection,
  TouchTargetsSection,
  NavigationPatternsSection,
  FormsMobileSection,
  TablesMobileSection,
  ModalsResponsiveSection,
  MobileChecklistSection,
} from "./sections/responsive";

import {
  DashboardV2LayoutSection,
  DashboardHeaderSection,
  KpiRowSection,
  CreditUsageChartSection,
  TopTracksSection,
  PlatformBreakdownSection,
  RecentActivitySection,
  WalletSectionDoc,
  AlertsSectionDoc,
  DashboardEmptyV2Section,
} from "./sections/dashboard-v2";

import {
  CatalogPageSection,
  CatalogHeaderSection,
  FilterPanelSection,
  TrackCardSection,
  TrackRowSection,
  TrackListSection,
  ThemedCardsSection,
  PlatformBadgeSection,
  CatalogPaginationSection,
  CatalogEmptyStatesSection,
  TrackDetailPageSection,
  SimilarTracksSection,
  TrackDetailEmptyStatesSection,
} from "./sections/catalog";

import {
  ToastSection,
  BannerSection,
  ModalFeedbackSection,
  WalletPillSection,
  BolsaPillSection,
  LicenseBadgeSection,
  NotifTokensSection,
} from "./sections/notifications";

const SECTION_REGISTRY: Record<string, React.ComponentType> = {
  intro: IntroSection,
  principles: PrinciplesSection,
  changelog: ChangelogSection,
  contributing: ContributingSection,
  brand: BrandSection,
  "voice-tone": VoiceToneSection,
  colors: ColorsSection,
  typography: TypographySection,
  radius: RadiusSection,
  spacing: SpacingSection,
  borders: BordersSection,
  animations: AnimationsSection,
  shadows: ShadowsSection,
  icons: IconsSection,
  buttons: ButtonsSection,
  cards: CardsSection,
  "kpi-card": KPICardSection,
  "empty-state-card": EmptyStateCardSection,
  "image-overlay-card": ImageOverlayCardSection,
  "top-item-row": TopItemRowSection,
  avatar: AvatarSection,
  forms: FormsSection,
  badges: BadgesSection,
  materials: MaterialsSection,
  "frosted-header": FrostedHeaderSection,
  player: PlayerSection,
  sidebar: SidebarSection,
  popover: PopoverSection,
  "page-shell": PageShellSection,
  "body-card": BodyCardSection,
  "app-layout": AppLayoutSection,
  "layout-dashboard-v2": LayoutDashboardV2Section,
  // Responsive & Mobile
  "responsive-overview": ResponsiveTOCSection,
  "responsive-breakpoints": BreakpointsSection,
  "responsive-layouts": LayoutPatternsSection,
  "responsive-typography": TypographyScaleSection,
  "responsive-spacing": SpacingResponsiveSection,
  "responsive-touch": TouchTargetsSection,
  "responsive-navigation": NavigationPatternsSection,
  "responsive-forms": FormsMobileSection,
  "responsive-tables": TablesMobileSection,
  "responsive-modals": ModalsResponsiveSection,
  "responsive-checklist": MobileChecklistSection,
  // Dashboard v2
  "dashboard-v2-layout": DashboardV2LayoutSection,
  "dashboard-header": DashboardHeaderSection,
  "kpi-row": KpiRowSection,
  "credit-usage-chart": CreditUsageChartSection,
  "top-tracks": TopTracksSection,
  "platform-breakdown": PlatformBreakdownSection,
  "recent-activity": RecentActivitySection,
  "wallet-section": WalletSectionDoc,
  "alerts-section": AlertsSectionDoc,
  "dashboard-empty-v2": DashboardEmptyV2Section,
  // Catalog
  "catalog-page": CatalogPageSection,
  "catalog-header": CatalogHeaderSection,
  "filter-panel": FilterPanelSection,
  "track-card": TrackCardSection,
  "track-row": TrackRowSection,
  "track-list": TrackListSection,
  "themed-cards": ThemedCardsSection,
  "platform-badge": PlatformBadgeSection,
  "catalog-pagination": CatalogPaginationSection,
  "catalog-empty-states": CatalogEmptyStatesSection,
  "track-detail-page": TrackDetailPageSection,
  "similar-tracks": SimilarTracksSection,
  "track-detail-empty-states": TrackDetailEmptyStatesSection,
  // Notifications
  toast: ToastSection,
  banner: BannerSection,
  "modal-feedback": ModalFeedbackSection,
  "wallet-pill": WalletPillSection,
  "bolsa-pill": BolsaPillSection,
  "license-badge": LicenseBadgeSection,
  "notif-tokens": NotifTokensSection,
};

/**
 * Per-section outer width treatment:
 * - "article": narrow centered prose (Get Started, Brand)
 * - "foundation": wide single column for token grids (Foundations)
 * - "default": no extra width cap → respects 6xl page container
 *   Components / Responsive / Dashboard v2 / Catalog use the page width
 *   and apply `<DSSectionBody layout="split" />` internally where needed.
 */
const SECTION_LAYOUT: Record<string, "article" | "foundation" | "default" | "wide"> = {
  // Get Started
  intro: "article",
  principles: "article",
  changelog: "article",
  contributing: "article",
  // Brand
  brand: "article",
  "voice-tone": "article",
  // Foundations
  colors: "foundation",
  typography: "foundation",
  radius: "foundation",
  spacing: "foundation",
  borders: "foundation",
  animations: "foundation",
  shadows: "foundation",
  icons: "foundation",
  // Components
  buttons: "wide",
  cards: "wide",
  "kpi-card": "wide",
  "empty-state-card": "wide",
  "image-overlay-card": "wide",
  "top-item-row": "wide",
  avatar: "wide",
  forms: "wide",
  badges: "wide",
  materials: "wide",
  "frosted-header": "wide",
  player: "wide",
  sidebar: "wide",
  popover: "wide",
  // Layouts
  "page-shell": "wide",
  "body-card": "wide",
  "app-layout": "wide",
  "layout-dashboard-v2": "wide",
  // Responsive
  "responsive-overview": "wide",
  "responsive-breakpoints": "wide",
  "responsive-layouts": "wide",
  "responsive-typography": "wide",
  "responsive-spacing": "wide",
  "responsive-touch": "wide",
  "responsive-navigation": "wide",
  "responsive-forms": "wide",
  "responsive-tables": "wide",
  "responsive-modals": "wide",
  "responsive-checklist": "wide",
  // Dashboard v2
  "dashboard-v2-layout": "wide",
  "dashboard-header": "wide",
  "kpi-row": "wide",
  "credit-usage-chart": "wide",
  "top-tracks": "wide",
  "platform-breakdown": "wide",
  "recent-activity": "wide",
  "wallet-section": "wide",
  "alerts-section": "wide",
  "dashboard-empty-v2": "wide",
  // Catalog
  "catalog-page": "wide",
  "catalog-header": "wide",
  "filter-panel": "wide",
  "track-card": "wide",
  "track-row": "wide",
  "track-list": "wide",
  "themed-cards": "wide",
  "platform-badge": "wide",
  "catalog-pagination": "wide",
  "catalog-empty-states": "wide",
  "track-detail-page": "wide",
  "similar-tracks": "wide",
  "track-detail-empty-states": "wide",
  // Notifications
  toast: "wide",
  banner: "wide",
  "modal-feedback": "wide",
  "wallet-pill": "wide",
  "bolsa-pill": "wide",
  "license-badge": "wide",
  "notif-tokens": "wide",
};

const ALL_SECTION_IDS = NAV_GROUPS.flatMap((g) => g.sections.map((s) => s.id));

export default function DesignSystem() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { visibleIds, filteredGroups } = useSearchFilter(searchQuery);
  const sectionIds = useMemo(() => ALL_SECTION_IDS, []);
  const activeId = useScrollSpy(sectionIds);

  return (
    <div className="min-h-screen bg-background">
      <DSTopBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onMenuClick={() => setSidebarOpen((v) => !v)}
        activeId={activeId}
      />
      <DSSidebar
        groups={filteredGroups}
        activeId={activeId}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        forceOpenAll={searchQuery.trim().length > 0}
      />
      <main className="lg:ml-56 pt-[60px]">
        <div className="max-w-[1400px] mx-auto p-6 lg:p-10">
          {ALL_SECTION_IDS.map((id) => {
            const Component = SECTION_REGISTRY[id];
            if (!Component) return null;
            const layout = SECTION_LAYOUT[id] ?? "default";
            return (
              <DSSectionShell key={id} hidden={!visibleIds.has(id)} layout={layout}>
                <Component />
              </DSSectionShell>
            );
          })}
        </div>
      </main>
    </div>
  );
}
