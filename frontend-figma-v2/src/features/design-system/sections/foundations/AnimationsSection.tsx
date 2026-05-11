import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DSSectionHeader } from "../../components/DSSectionHeader";

const TODAY = "2026-04-17";

const ROWS = [
  { name: "fade-in", duration: "0.3s", easing: "ease-out", tw: "animate-fade-in" },
  { name: "scale-in", duration: "0.2s", easing: "ease-out", tw: "animate-scale-in" },
  { name: "slide-in-right", duration: "0.3s", easing: "ease-out", tw: "animate-slide-in-right" },
  { name: "pulse", duration: "2s", easing: "ease-in-out", tw: "animate-pulse" },
];

function AnimationDemo({ name, className, replay }: { name: string; className: string; replay: string }) {
  const [key, setKey] = useState(0);
  return (
    <div className="flex flex-col items-center gap-2">
      <div key={key} className={`w-20 h-20 bg-primary rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-xs font-bold text-primary-foreground">{name}</span>
      </div>
      <button
        onClick={() => setKey((k) => k + 1)}
        className="text-xs text-muted-foreground underline hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {replay}
      </button>
    </div>
  );
}

export function AnimationsSection() {
  const { t } = useTranslation("designSystem");
  const h = t("sections.animations.headers", { returnObjects: true }) as Record<string, string>;
  return (
    <>
      <DSSectionHeader id="animations" title={t("sections.animations.title")} status="stable" lastUpdate={TODAY} />
      <p className="text-sm text-muted-foreground mb-4 p-3 bg-muted rounded-lg">{t("sections.animations.note")}</p>
      <div className="bg-card rounded-card border border-border overflow-hidden mb-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="text-left p-3 font-semibold text-foreground">{h.name}</th>
              <th className="text-left p-3 font-semibold text-foreground">{h.duration}</th>
              <th className="text-left p-3 font-semibold text-foreground">{h.easing}</th>
              <th className="text-left p-3 font-semibold text-foreground">{h.tailwind}</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.name} className="border-t border-border">
                <td className="p-3 text-foreground">{r.name}</td>
                <td className="p-3 text-muted-foreground">{r.duration}</td>
                <td className="p-3 text-muted-foreground">{r.easing}</td>
                <td className="p-3"><code className="text-xs bg-muted px-1 rounded text-foreground">{r.tw}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h4 className="text-sm font-semibold text-foreground mb-3">{t("sections.animations.live")}</h4>
      <div className="flex flex-wrap gap-4">
        <AnimationDemo name="fade-in" className="animate-fade-in" replay={t("sections.animations.replay")} />
        <AnimationDemo name="scale-in" className="animate-scale-in" replay={t("sections.animations.replay")} />
        <AnimationDemo name="pulse" className="animate-pulse" replay={t("sections.animations.replay")} />
      </div>
    </>
  );
}
