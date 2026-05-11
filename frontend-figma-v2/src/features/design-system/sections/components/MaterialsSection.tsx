import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DSSectionHeader } from "../../components/DSSectionHeader";
import { DSSectionBody } from "../../components/DSSectionBody";
import {
  DSComponentSpec,
  DSAnatomy,
  DSVariants,
  DSUsage,
  DSCode,
  DSCollapsibleA11y,
  DSCollapsibleTokens,
} from "../../components/spec";

const TODAY = "2026-04-17";
const GENRES = ["popLatino", "reggaeton", "electronica"] as const;

/**
 * Background imagery for material demos.
 * Source: Unsplash (free to use under the Unsplash License — no attribution
 * required, commercial use allowed). URLs are stable `images.unsplash.com/photo-…`
 * format. Same covers reused from `src/features/metrics/mocks/tracks.ts` for
 * consistency.
 */
const MUSIC_BG_NAVBAR =
  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&q=80"; // estudio
const GENRE_BGS: Record<(typeof GENRES)[number], string> = {
  popLatino:    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
  reggaeton:    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80",
  electronica:  "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=800&q=80",
};
const GLASS_BTN_BG =
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&q=80"; // vinilo

export function MaterialsSection() {
  const { t } = useTranslation("designSystem");
  const anatomy = t("spec.materials.anatomy", { returnObjects: true }) as Array<{ name: string; desc: string }>;
  const a11y = t("spec.materials.a11y", { returnObjects: true }) as string[];
  const dos = t("spec.materials.do", { returnObjects: true }) as string[];
  const donts = t("spec.materials.dont", { returnObjects: true }) as string[];

  return (
    <>
      <DSSectionHeader
        id="materials"
        title={t("sections.materials.title")}
        status="stable"
        lastUpdate={TODAY}
        componentName="navbar-frosted · sidebar-frosted · card-blur-content · btn-glass"
      />
      <DSComponentSpec description={t("spec.materials.description")} layout="split">
        <DSSectionBody
          layout="split"
          left={
            <>
              <DSAnatomy parts={anatomy} />
              <DSUsage dos={dos} donts={donts} />
              <DSCollapsibleA11y items={a11y} />
              <DSCollapsibleTokens
                tokens={[
                  "navbar-frosted",
                  "sidebar-frosted",
                  "card-blur-content",
                  "btn-glass",
                  "backdrop-filter: blur(60px)",
                  "hsl(var(--sidebar-bg) / 0.6)",
                ]}
              />
            </>
          }
          right={
            <>
              <DSVariants>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  {t("sections.materials.frostedNavbar")}
                </h4>
                <div className="relative bg-lm-black rounded-card overflow-hidden mb-8">
                  <img
                    src={MUSIC_BG_NAVBAR}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="relative">
                  <div className="navbar-frosted h-[60px] flex items-center justify-between px-5">
                    <span className="text-[white] font-bold text-lg">licénciame</span>
                    <div className="flex items-center gap-3">
                      <Button variant="glass" size="sm">{t("sections.materials.navItems.register")}</Button>
                      <Button size="sm">{t("sections.materials.navItems.signIn")}</Button>
                    </div>
                  </div>
                  <div className="h-24 flex items-center justify-center text-white/80 text-xs px-4 text-center">
                    {t("sections.materials.blurNote")}
                  </div>
                  </div>
                </div>

                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  {t("sections.materials.glassButton")}
                </h4>
                <div className="relative bg-lm-black p-6 rounded-card overflow-hidden mb-8">
                  <img
                    src={GLASS_BTN_BG}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="relative flex flex-wrap items-center gap-3">
                  <Button variant="glass">{t("sections.materials.navItems.register")}</Button>
                  <Button variant="glass" size="sm">Small</Button>
                  <Button variant="glass" size="lg">Large</Button>
                  </div>
                </div>

                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  {t("sections.materials.blurCard")}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {GENRES.map((g) => (
                    <div key={g} className="relative overflow-hidden rounded-card h-44 group cursor-pointer">
                      <img
                        src={GENRE_BGS[g]}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute bottom-0 left-0 right-0 card-blur-content p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-base font-bold text-lm-black">{t(`sections.materials.genres.${g}`)}</h4>
                            <p className="text-xs text-lm-gray-700">{t("sections.materials.tracksCount")}</p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-lm-black" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* gradient-text demo removed (Prompt 6 cleanup): 0 production callsites */}
              </DSVariants>

              <DSCode snippet={t("spec.materials.code")} collapsedByDefault />
            </>
          }
        />
      </DSComponentSpec>
    </>
  );
}
