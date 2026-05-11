import { Facebook, Instagram, Music2 } from "lucide-react";
import { KpiCard } from "./KpiCard";
import { editorialStrings } from "../strings";

/**
 * Three secondary KPIs: active licenses, publications, favorite tracks.
 * Grid: 1 col on mobile, 2 cols on md (3rd full width), 3 cols on lg.
 */
export function KpiRow() {
  const t = editorialStrings.kpis;

  return (
    <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      <KpiCard
        label={t.activeLicensesLabel}
        value="17"
        footer={<span className="text-success">{t.activeLicensesDelta}</span>}
      />

      <KpiCard
        label={t.publicationsLabel}
        value="34"
        footer={
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <span className="inline-flex items-center gap-1.5">
              <Instagram className="h-3.5 w-3.5" aria-hidden="true" />
              IG 18
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Music2 className="h-3.5 w-3.5" aria-hidden="true" />
              TT 12
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Facebook className="h-3.5 w-3.5" aria-hidden="true" />
              FB 4
            </span>
          </div>
        }
      />

      <div className="md:col-span-2 lg:col-span-1">
        <KpiCard
          label={t.favoritesLabel}
          value="28"
          footer={<span className="text-success">{t.favoritesDelta}</span>}
        />
      </div>
    </section>
  );
}
